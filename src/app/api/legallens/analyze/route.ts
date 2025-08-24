import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import OpenAI from 'openai';

interface AnalysisRequest {
  type: 'text' | 'image' | 'video';
  content: string; // text content or base64 encoded media or URL
  filename?: string;
}

interface ComplianceViolation {
  rule_name: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  specific_issue: string;
  recommendation: string;
}

interface ComplianceWarning {
  rule_name: string;
  category: string;
  description: string;
  recommendation: string;
}

interface AnalysisResult {
  compliance_score: number;
  overall_assessment: string;
  violations: ComplianceViolation[];
  warnings: ComplianceWarning[];
  analysis_summary: string;
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to calculate hash for content
function generateContentHash(content: string): string {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
}

// Helper function to fetch active legal rules
async function fetchActiveLegalRules(): Promise<Array<{
  id: string;
  name: string;
  category: string;
  description?: string;
  rules_content: string;
  severity: string;
  is_active: boolean;
}>> {
  const { data, error } = await supabase
    .from('legal_compliance_rules')
    .select('*')
    .eq('is_active', true)
    .order('severity DESC, category, name');

  if (error) {
    console.error('Error fetching legal rules:', error);
    throw new Error('Failed to fetch legal compliance rules');
  }

  return data || [];
}

// Helper function to analyze text content
async function analyzeTextContent(content: string, legalRules: Array<{name: string; category: string; severity: string; rules_content: string}>): Promise<AnalysisResult> {
  const rulesContext = legalRules.map(rule => 
    `${rule.name} (${rule.category}, ${rule.severity}): ${rule.rules_content}`
  ).join('\n\n');

  const systemPrompt = `You are a legal compliance expert analyzing advertising content against specific legal regulations. 

LEGAL RULES TO CHECK AGAINST:
${rulesContext}

Your task is to analyze the provided content and return a JSON response with this exact structure:

{
  "compliance_score": <number 0-100>,
  "overall_assessment": "<brief summary of compliance status>",
  "violations": [
    {
      "rule_name": "<name of violated rule>",
      "category": "<category>",
      "severity": "<low|medium|high|critical>",
      "description": "<what rule was violated>",
      "specific_issue": "<specific part of content that violates>",
      "recommendation": "<how to fix>"
    }
  ],
  "warnings": [
    {
      "rule_name": "<name of rule with potential issues>",
      "category": "<category>",
      "description": "<potential concern>",
      "recommendation": "<suggestion for improvement>"
    }
  ],
  "analysis_summary": "<detailed explanation of analysis>"
}

SCORING GUIDELINES:
- 90-100: Fully compliant, no issues
- 70-89: Minor warnings, mostly compliant
- 50-69: Some violations, needs attention
- 30-49: Multiple violations, significant issues
- 0-29: Major violations, high legal risk

Be thorough but practical. Focus on clear, actionable violations and warnings.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze this advertising content for legal compliance:\n\n${content}` }
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result as AnalysisResult;
  } catch (error) {
    console.error('OpenAI analysis error:', error);
    throw new Error('Failed to analyze text content');
  }
}

// Helper function to analyze image content
async function analyzeImageContent(imageData: string, legalRules: Array<{name: string; category: string; severity: string; rules_content: string}>): Promise<AnalysisResult> {
  const rulesContext = legalRules.map(rule => 
    `${rule.name} (${rule.category}, ${rule.severity}): ${rule.rules_content}`
  ).join('\n\n');

  const systemPrompt = `You are analyzing advertising images for legal compliance. Check against these legal rules:

${rulesContext}

Analyze both the visual content and any text visible in the image. Return JSON with the same structure as text analysis.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        { 
          role: 'system', 
          content: systemPrompt 
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this advertising image for legal compliance violations and warnings:'
            },
            {
              type: 'image_url',
              image_url: {
                url: imageData.startsWith('data:') ? imageData : `data:image/jpeg;base64,${imageData}`
              }
            }
          ]
        }
      ],
      temperature: 0.1,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result as AnalysisResult;
  } catch (error) {
    console.error('OpenAI image analysis error:', error);
    throw new Error('Failed to analyze image content');
  }
}

// Helper function to analyze video content using Gemini
async function analyzeVideoContent(videoUrl: string, legalRules: Array<{name: string; category: string; description?: string}>): Promise<AnalysisResult> {
  // Note: For now, return a placeholder response since Gemini integration is complex
  // In a full implementation, you would use Google's Gemini API to analyze video content
  
  const rulesContext = legalRules.map(rule => 
    `${rule.name} (${rule.category}): ${rule.description}`
  ).join(', ');

  return {
    compliance_score: 75,
    overall_assessment: "Video analysis requires manual review - automated video analysis coming soon",
    violations: [],
    warnings: [{
      rule_name: "Video Analysis",
      category: "general", 
      description: "Video content analysis is not yet fully automated",
      recommendation: `Please manually review video content against these rules: ${rulesContext}`
    }],
    analysis_summary: "Video analysis feature is in development. Please conduct manual review of video content against all applicable legal compliance rules."
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json();

    if (!body.type || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields: type, content' },
        { status: 400 }
      );
    }

    if (!['text', 'image', 'video'].includes(body.type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be text, image, or video' },
        { status: 400 }
      );
    }

    // Fetch active legal rules
    const legalRules = await fetchActiveLegalRules();
    
    if (legalRules.length === 0) {
      return NextResponse.json(
        { error: 'No active legal compliance rules found. Please add rules in admin panel.' },
        { status: 400 }
      );
    }

    // Generate content hash
    const contentHash = generateContentHash(body.content);

    // Check if we've analyzed this content before
    const { data: existingAnalysis } = await supabase
      .from('legal_analysis_history')
      .select('*')
      .eq('content_hash', contentHash)
      .eq('content_type', body.type)
      .order('created_at', { ascending: false })
      .limit(1);

    let analysisResult: AnalysisResult;

    if (existingAnalysis && existingAnalysis.length > 0) {
      // Return cached result
      analysisResult = existingAnalysis[0].analysis_result as AnalysisResult;
    } else {
      // Perform new analysis based on content type
      switch (body.type) {
        case 'text':
          analysisResult = await analyzeTextContent(body.content, legalRules);
          break;
        case 'image':
          analysisResult = await analyzeImageContent(body.content, legalRules);
          break;
        case 'video':
          analysisResult = await analyzeVideoContent(body.content, legalRules);
          break;
        default:
          throw new Error('Invalid content type');
      }

      // Store analysis result in history
      const { error: historyError } = await supabase
        .from('legal_analysis_history')
        .insert({
          content_type: body.type,
          content_hash: contentHash,
          analysis_result: analysisResult,
          compliance_score: analysisResult.compliance_score,
          violations: analysisResult.violations,
          warnings: analysisResult.warnings
        });

      if (historyError) {
        console.error('Error storing analysis history:', historyError);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...analysisResult,
        content_type: body.type,
        filename: body.filename,
        cached: existingAnalysis && existingAnalysis.length > 0
      }
    });

  } catch (error) {
    console.error('Legal analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}