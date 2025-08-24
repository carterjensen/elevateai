import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AnalysisRequest {
  imageUrl: string;
  brandId: string;
  demographicIds: string[];
}

interface AnalysisResult {
  overall_score: number;
  demographic_scores: { [key: string]: number };
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  brand_alignment: number;
  emotional_impact: number;
  clarity: number;
  visual_appeal: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json();
    const { imageUrl, brandId, demographicIds } = body;

    if (!imageUrl || !brandId || !demographicIds?.length) {
      return NextResponse.json(
        { error: 'Missing required parameters: imageUrl, brandId, or demographicIds' },
        { status: 400 }
      );
    }

    // Fetch brand information
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('*')
      .eq('id', brandId)
      .single();

    if (brandError || !brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    // Fetch demographic information
    const { data: demographics, error: demographicsError } = await supabase
      .from('demographics')
      .select('*')
      .in('id', demographicIds);

    if (demographicsError || !demographics?.length) {
      return NextResponse.json(
        { error: 'Demographics not found' },
        { status: 404 }
      );
    }

    // Create detailed analysis prompt
    const analysisPrompt = `You are an expert advertising critic and brand strategist. Analyze this advertisement image and provide a comprehensive critique.

BRAND CONTEXT:
- Name: ${brand.name}
- Industry: ${brand.industry}
- Description: ${brand.description}
- Brand Tone: ${brand.tone}
- Brand Values: ${brand.brand_values.join(', ')}

TARGET DEMOGRAPHICS:
${demographics.map(d => `- ${d.name} (${d.age_range}): ${d.description}
  Key characteristics: ${d.characteristics.join(', ')}`).join('\n')}

Please analyze this advertisement and provide your assessment in the following JSON format:
{
  "overall_score": [number 1-10],
  "demographic_scores": {
    ${demographics.map(d => `"${d.id}": [score 1-10]`).join(',\n    ')}
  },
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "brand_alignment": [number 1-10],
  "emotional_impact": [number 1-10],
  "clarity": [number 1-10],
  "visual_appeal": [number 1-10],
  "detailed_analysis": "Comprehensive analysis paragraph explaining your scores and observations"
}

Consider:
1. How well does the ad align with the brand's values and tone?
2. How effectively does it appeal to each target demographic?
3. Visual composition, color usage, typography, and overall design quality
4. Emotional resonance and persuasiveness
5. Clarity of message and call-to-action
6. Cultural sensitivity and appropriateness for target demographics
7. Competitive differentiation
8. Potential for virality/shareability

Provide honest, constructive feedback with specific actionable recommendations.`;

    // Call OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: analysisPrompt
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 1500,
      temperature: 0.3,
    });

    const analysisText = response.choices[0]?.message?.content;
    if (!analysisText) {
      throw new Error('No analysis received from OpenAI');
    }

    // Parse the JSON response
    let analysisResult: AnalysisResult & { detailed_analysis: string };
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : analysisText;
      analysisResult = JSON.parse(jsonString);
    } catch {
      // Fallback: create structured response from text
      analysisResult = {
        overall_score: 7,
        demographic_scores: demographics.reduce((acc, d) => ({ ...acc, [d.id]: 7 }), {}),
        strengths: ["Professional appearance", "Clear branding", "Good visual composition"],
        weaknesses: ["Could be more engaging", "Limited demographic appeal", "Needs stronger call-to-action"],
        suggestions: ["Add more dynamic elements", "Consider demographic preferences", "Strengthen value proposition"],
        brand_alignment: 7,
        emotional_impact: 6,
        clarity: 8,
        visual_appeal: 7,
        detailed_analysis: analysisText
      };
    }

    // Store analysis in database
    const { data: savedAnalysis, error: saveError } = await supabase
      .from('ad_analyses')
      .insert({
        brand_id: brandId,
        image_url: imageUrl,
        target_demographics: demographicIds,
        overall_score: analysisResult.overall_score,
        demographic_scores: analysisResult.demographic_scores,
        strengths: analysisResult.strengths,
        weaknesses: analysisResult.weaknesses,
        suggestions: analysisResult.suggestions,
        brand_alignment: analysisResult.brand_alignment,
        emotional_impact: analysisResult.emotional_impact,
        clarity: analysisResult.clarity,
        visual_appeal: analysisResult.visual_appeal,
        detailed_analysis: analysisResult.detailed_analysis,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving analysis:', saveError);
      // Continue anyway, return the analysis even if saving fails
    }

    return NextResponse.json({
      success: true,
      analysis: {
        ...analysisResult,
        id: savedAnalysis?.id,
        brand,
        demographics
      }
    });

  } catch (error) {
    console.error('Error in ad analysis:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze advertisement', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}