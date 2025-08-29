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
    // If database tables don't exist, return mock rules for testing
    console.log('Database tables not found, using mock legal rules');
    return [
      {
        id: '1',
        name: 'Truth in Advertising',
        category: 'general',
        description: 'Advertisements must not contain false, misleading, or deceptive claims',
        rules_content: 'All advertising claims must be truthful, substantiated, and not misleading. Claims must be supported by competent and reliable evidence. Avoid exaggerated claims, false testimonials, or misleading comparisons.',
        severity: 'high',
        is_active: true
      },
      {
        id: '2',
        name: 'Healthcare Advertising Standards',
        category: 'healthcare',
        description: 'Special requirements for medical and health-related claims',
        rules_content: 'Health claims must be supported by clinical evidence. Drug advertisements must include risk information and contraindications. Medical device claims must comply with FDA regulations. No false cure claims.',
        severity: 'critical',
        is_active: true
      },
      {
        id: '3',
        name: 'Financial Services Compliance',
        category: 'financial',
        description: 'Truth in Lending and financial advertising requirements',
        rules_content: 'Interest rates and fees must be clearly disclosed. Credit terms must be accurate and complete. Investment disclaimers required for financial products. Risk disclosures mandatory for investment services.',
        severity: 'high',
        is_active: true
      },
      {
        id: '4',
        name: 'Privacy and Data Collection',
        category: 'privacy',
        description: 'GDPR, CCPA, and privacy law compliance',
        rules_content: 'Privacy policies must be clear and accessible. Consent required for data collection and cookies. Users must be able to opt-out. Data usage must match stated purposes. International users require GDPR compliance.',
        severity: 'high',
        is_active: true
      }
    ];
  }

  return data || [];
}

// Helper function to load system prompt from file
async function loadLegalSystemPrompt(legalRules: Array<{name: string; category: string; severity: string; rules_content: string}>): Promise<string> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const promptPath = path.join(process.cwd(), 'data', 'prompts', 'legal-lens', 'system-prompt.md');
    const outputPath = path.join(process.cwd(), 'data', 'prompts', 'legal-lens', 'output-template.json');
    
    const systemPrompt = await fs.readFile(promptPath, 'utf-8');
    const outputTemplate = await fs.readFile(outputPath, 'utf-8');
    
    // Create legal rules context
    const rulesContext = legalRules.map(rule => 
      `${rule.name} (${rule.category}, ${rule.severity}): ${rule.rules_content}`
    ).join('\n\n');
    
    // Replace template variables
    const dynamicPrompt = systemPrompt
      .replace(/{{legal_rules_context}}/g, rulesContext);
    
    // Add output format instructions
    return `${dynamicPrompt}\n\nIMPORTANT: Return your response as valid JSON matching this structure:\n${outputTemplate}`;
    
  } catch (error) {
    console.error('Error loading legal lens prompts:', error);
    // Fallback to original hardcoded prompt
    const rulesContext = legalRules.map(rule => 
      `${rule.name} (${rule.category}, ${rule.severity}): ${rule.rules_content}`
    ).join('\n\n');
    
    return `You are a legal compliance expert analyzing advertising content against specific legal regulations. 

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
  }
}

// Helper function to analyze text content
async function analyzeTextContent(content: string, legalRules: Array<{name: string; category: string; severity: string; rules_content: string}>): Promise<AnalysisResult> {
  const systemPrompt = await loadLegalSystemPrompt(legalRules);

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
  const baseSystemPrompt = await loadLegalSystemPrompt(legalRules);
  const systemPrompt = `${baseSystemPrompt}\n\nSPECIAL INSTRUCTIONS FOR IMAGE ANALYSIS:\nAnalyze both the visual content and any text visible in the image. Consider visual implications, implied claims, and overall messaging conveyed through imagery.`;

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

// Helper function to analyze video content - Enhanced with better messaging
async function analyzeVideoContent(videoInfo: string, legalRules: Array<{name: string; category: string; rules_content: string; severity: string}>): Promise<AnalysisResult> {
  // Extract video info from the content string
  const [, filename, sizeStr] = videoInfo.split(':');
  const sizeInMB = sizeStr ? (parseInt(sizeStr) / 1024 / 1024).toFixed(1) : 'unknown';
  
  const rulesContext = legalRules.map(rule => 
    `• ${rule.name} (${rule.category}, ${rule.severity}): ${rule.rules_content.substring(0, 100)}...`
  ).join('\n');

  return {
    compliance_score: 80,
    overall_assessment: `Video "${filename}" received for analysis. Manual review recommended for complete compliance assessment.`,
    violations: [],
    warnings: [
      {
        rule_name: "Video Analysis - Manual Review Required",
        category: "video-analysis", 
        description: "Automated video content analysis is currently in development. This video file has been processed but requires manual review for complete legal compliance verification.",
        recommendation: `Please have a legal expert manually review "${filename}" (${sizeInMB}MB) against the following compliance areas: ${legalRules.map(r => r.category).join(', ')}`
      }
    ],
    analysis_summary: `Video file "${filename}" (${sizeInMB}MB) has been received and basic validation completed. 

MANUAL REVIEW REQUIRED FOR:
${rulesContext}

NEXT STEPS:
1. Download and review the video content manually
2. Check for any spoken claims, visual representations, or text overlays
3. Verify compliance with all ${legalRules.length} active legal rules
4. Document any violations or concerns
5. Update compliance records accordingly

Automated video analysis with AI transcription and visual analysis is planned for a future release.`
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

    // Check if we've analyzed this content before (skip if table doesn't exist)
    let existingAnalysis = null;
    try {
      const { data } = await supabase
        .from('legal_analysis_history')
        .select('*')
        .eq('content_hash', contentHash)
        .eq('content_type', body.type)
        .order('created_at', { ascending: false })
        .limit(1);
      existingAnalysis = data;
    } catch (error) {
      console.log('Analysis history table not found, performing fresh analysis');
    }

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

      // Store analysis result in history (skip if table doesn't exist)
      try {
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
      } catch (error) {
        console.log('Analysis history table not found, skipping history storage');
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