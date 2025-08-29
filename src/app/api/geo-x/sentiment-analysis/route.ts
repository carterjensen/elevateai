import { NextRequest, NextResponse } from 'next/server';
import { GrokService } from '@/lib/grokService';

interface SentimentAnalysisRequest {
  brandName: string;
  queries: string[];
  platforms: ('openai' | 'grok')[];
}

interface MetricScore {
  score: number;
  reasoning: string;
  examples: string[];
}

interface KeyQuote {
  quote: string;
  context: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  topic: string;
  source_query: string;
}

interface QualitativeInsights {
  keyQuotes: KeyQuote[];
  themes: Array<{
    theme: string;
    mentions: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    examples: string[];
  }>;
  strengthsWeaknesses: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
  };
}

interface PlatformAnalysis {
  platform: 'openai' | 'grok';
  responses: Array<{
    query: string;
    response: string;
    sources?: Array<{
      type: string;
      title: string;
      url: string;
      snippet: string;
      author?: string;
      date?: string;
    }>;
    processingTime: number;
  }>;
  metrics: {
    quality: MetricScore;
    value: MetricScore;
    trust: MetricScore;
    customerExperience: MetricScore;
    brandReputation: MetricScore;
    innovation: MetricScore;
    sustainability: MetricScore;
    emotionalConnection: MetricScore;
  };
  overallSentiment: {
    score: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    confidence: number;
  };
  qualitativeInsights: QualitativeInsights;
}

interface SentimentAnalysisResponse {
  brandName: string;
  platforms: PlatformAnalysis[];
  comparison: {
    averageScores: {
      openai?: { [key: string]: number };
      grok?: { [key: string]: number };
    };
    strongestMetrics: string[];
    weakestMetrics: string[];
    recommendations: string[];
  };
}

// Define brand sentiment queries
const getBrandSentimentQueries = (brandName: string): string[] => [
  `What is the quality and reliability of ${brandName} products?`,
  `Is ${brandName} a good value for money? What do customers think about pricing?`,
  `How trustworthy and reliable is ${brandName} as a company?`,
  `What is the customer service experience like with ${brandName}?`,
  `What is ${brandName}'s reputation in the market and among consumers?`,
  `How innovative and forward-thinking is ${brandName}?`,
  `What are ${brandName}'s sustainability and ethical practices?`,
  `How do customers emotionally connect with the ${brandName} brand?`
];

// OpenAI API call
async function callOpenAI(query: string): Promise<{ response: string; processingTime: number }> {
  const startTime = Date.now();
  const openaiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a knowledgeable assistant that provides comprehensive, balanced information about brands and products. Include both positive and negative aspects when discussing brands. Be specific and provide concrete examples when possible.'
        },
        {
          role: 'user',
          content: query
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: HTTP ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const processingTime = Date.now() - startTime;
  
  return {
    response: data.choices[0]?.message?.content || 'No response available',
    processingTime
  };
}

// Grok API call
async function callGrok(query: string): Promise<{ 
  response: string; 
  sources: Array<{ type: string; title: string; url: string; snippet: string; author?: string; date?: string; }>; 
  processingTime: number 
}> {
  const startTime = Date.now();
  const grokApiKey = process.env.GROK_API_KEY || process.env.XAI_API_KEY;
  
  if (!grokApiKey) {
    throw new Error('Grok API key not configured');
  }

  const grokService = new GrokService(grokApiKey);
  
  const systemPrompt = `You are a comprehensive brand analyst that provides balanced, data-driven insights about companies and products. 

INSTRUCTIONS:
- Use web search and social media search to find current information
- Provide both positive and negative perspectives
- Include specific examples and data points
- Consider recent news, reviews, and social sentiment
- Be objective and comprehensive in your analysis`;

  const grokRequest = GrokService.createChatRequest(
    systemPrompt,
    query,
    [],
    {
      maxSources: 15,
      enableWebSearch: true,
      enableTwitterSearch: true,
      temperature: 0.7
    }
  );

  const result = await grokService.chat(grokRequest);
  const processingTime = Date.now() - startTime;
  
  return {
    response: result.response,
    sources: result.sources,
    processingTime
  };
}

// Analyze sentiment and extract metrics from responses
async function analyzeSentiment(responses: Array<{ query: string; response: string }>, brandName: string): Promise<PlatformAnalysis['metrics']> {
  const openaiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiKey) {
    console.error('OpenAI API key not configured for sentiment analysis');
    return getDefaultMetrics();
  }

  // Truncate responses if they're too long to avoid token limits
  const truncatedResponses = responses.map(r => ({
    ...r,
    response: r.response.length > 500 ? r.response.substring(0, 500) + '...' : r.response
  }));

  const analysisPrompt = `Analyze the following AI responses about ${brandName} and score them on these 8 metrics (1-10 scale).

CRITICAL: You MUST respond with ONLY valid JSON. No explanation text before or after.

Metrics to analyze:
1. Quality: Product/service performance, durability, craftsmanship
2. Value: Cost vs benefit ratio, pricing fairness
3. Trust: Reliability, consistency, company reputation
4. Customer Experience: Service quality, user experience, satisfaction
5. Brand Reputation: Market standing, public perception, loyalty
6. Innovation: Technology advancement, forward-thinking, adaptation
7. Sustainability: Environmental/social responsibility
8. Emotional Connection: Personal resonance, brand affinity, advocacy

RESPONSES TO ANALYZE:
${truncatedResponses.map((r, i) => `Query ${i + 1}: ${r.query}\nResponse: ${r.response}\n---`).join('\n')}

Return ONLY this JSON format (no other text):
{
  "quality": {"score": 7, "reasoning": "Brief analysis", "examples": ["example1", "example2"]},
  "value": {"score": 6, "reasoning": "Brief analysis", "examples": ["example1", "example2"]},
  "trust": {"score": 8, "reasoning": "Brief analysis", "examples": ["example1", "example2"]},
  "customerExperience": {"score": 7, "reasoning": "Brief analysis", "examples": ["example1", "example2"]},
  "brandReputation": {"score": 8, "reasoning": "Brief analysis", "examples": ["example1", "example2"]},
  "innovation": {"score": 7, "reasoning": "Brief analysis", "examples": ["example1", "example2"]},
  "sustainability": {"score": 6, "reasoning": "Brief analysis", "examples": ["example1", "example2"]},
  "emotionalConnection": {"score": 7, "reasoning": "Brief analysis", "examples": ["example1", "example2"]}
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Use faster, cheaper model for sentiment analysis
        messages: [
          {
            role: 'system',
            content: 'You are a precise sentiment analysis expert. You MUST return ONLY valid JSON with no additional text, explanation, or formatting. Start your response with { and end with }.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        max_tokens: 800, // Reduced tokens for faster response
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI sentiment analysis error:', response.status, errorText);
      throw new Error(`Sentiment analysis failed: HTTP ${response.status}`);
    }

    const data = await response.json();
    let analysisText = data.choices[0]?.message?.content;
    
    if (!analysisText) {
      console.error('No content in OpenAI response:', data);
      return getDefaultMetrics();
    }

    // Clean the response text
    analysisText = analysisText.trim();
    
    // Remove any text before the first {
    const startIndex = analysisText.indexOf('{');
    if (startIndex > 0) {
      analysisText = analysisText.substring(startIndex);
    }
    
    // Remove any text after the last }
    const endIndex = analysisText.lastIndexOf('}');
    if (endIndex >= 0 && endIndex < analysisText.length - 1) {
      analysisText = analysisText.substring(0, endIndex + 1);
    }

    console.log('Cleaned analysis text (first 200 chars):', analysisText.substring(0, 200));
    console.log('Full analysis text length:', analysisText.length);
    
    // Try to extract JSON from the response if it's embedded in other text
    let jsonToParse = analysisText;
    
    // Look for JSON patterns
    const jsonMatch = analysisText.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/);
    if (jsonMatch) {
      jsonToParse = jsonMatch[0];
      console.log('Found JSON match:', jsonToParse.substring(0, 100) + '...');
    }
    
    const parsedResult = JSON.parse(jsonToParse);
    
    // Validate the parsed result has all required fields
    const requiredFields = ['quality', 'value', 'trust', 'customerExperience', 'brandReputation', 'innovation', 'sustainability', 'emotionalConnection'];
    for (const field of requiredFields) {
      if (!parsedResult[field] || typeof parsedResult[field].score !== 'number') {
        console.warn(`Missing or invalid field: ${field}`);
        return getDefaultMetrics();
      }
    }
    
    return parsedResult;
    
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    return getDefaultMetrics();
  }
}

// Helper function to return default metrics
function getDefaultMetrics(): PlatformAnalysis['metrics'] {
  const defaultScore = { score: 5, reasoning: 'Analysis unavailable - using default score', examples: ['Unable to analyze at this time'] };
  return {
    quality: defaultScore,
    value: defaultScore,
    trust: defaultScore,
    customerExperience: defaultScore,
    brandReputation: defaultScore,
    innovation: defaultScore,
    sustainability: defaultScore,
    emotionalConnection: defaultScore,
  };
}

// Extract qualitative insights from AI responses
async function extractQualitativeInsights(responses: Array<{ query: string; response: string }>, brandName: string): Promise<QualitativeInsights> {
  const openaiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiKey) {
    console.error('OpenAI API key not configured for qualitative analysis');
    return getDefaultQualitativeInsights();
  }

  // Combine all responses for analysis
  const combinedText = responses.map(r => `Query: ${r.query}\nResponse: ${r.response}`).join('\n\n---\n\n');
  
  // Truncate if too long
  const truncatedText = combinedText.length > 8000 ? combinedText.substring(0, 8000) + '...[truncated]' : combinedText;

  const analysisPrompt = `Analyze the following AI responses about ${brandName} and extract qualitative insights.

CRITICAL: You MUST respond with ONLY valid JSON. No explanation text before or after.

Extract:
1. 6-8 KEY QUOTES: Most impactful, specific statements about the brand (both positive and negative)
2. THEMES: Common topics/patterns mentioned across responses
3. STRENGTHS: What AI says the brand does well
4. WEAKNESSES: Areas where AI identifies challenges or concerns
5. OPPORTUNITIES: Potential areas for improvement mentioned

AI RESPONSES TO ANALYZE:
${truncatedText}

Return ONLY this JSON format:
{
  "keyQuotes": [
    {
      "quote": "Exact quote from AI response",
      "context": "Brief context about what aspect this relates to",
      "sentiment": "positive|neutral|negative",
      "topic": "quality|value|trust|etc",
      "source_query": "The query that generated this response"
    }
  ],
  "themes": [
    {
      "theme": "Theme name",
      "mentions": 3,
      "sentiment": "positive|neutral|negative", 
      "examples": ["example1", "example2"]
    }
  ],
  "strengthsWeaknesses": {
    "strengths": ["strength1", "strength2", "strength3"],
    "weaknesses": ["weakness1", "weakness2"], 
    "opportunities": ["opportunity1", "opportunity2"]
  }
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert qualitative analyst. Extract meaningful insights and quotes from brand analysis responses. Return ONLY valid JSON with no additional text.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Qualitative analysis error:', response.status, errorText);
      return getDefaultQualitativeInsights();
    }

    const data = await response.json();
    let analysisText = data.choices[0]?.message?.content;
    
    if (!analysisText) {
      console.error('No content in qualitative analysis response');
      return getDefaultQualitativeInsights();
    }

    // Clean the response
    analysisText = analysisText.trim();
    const startIndex = analysisText.indexOf('{');
    if (startIndex > 0) {
      analysisText = analysisText.substring(startIndex);
    }
    const endIndex = analysisText.lastIndexOf('}');
    if (endIndex >= 0 && endIndex < analysisText.length - 1) {
      analysisText = analysisText.substring(0, endIndex + 1);
    }

    const parsedResult = JSON.parse(analysisText);
    
    // Validate structure
    if (!parsedResult.keyQuotes || !parsedResult.themes || !parsedResult.strengthsWeaknesses) {
      console.warn('Invalid qualitative insights structure');
      return getDefaultQualitativeInsights();
    }

    return parsedResult;
    
  } catch (error) {
    console.error('Qualitative analysis extraction error:', error);
    return getDefaultQualitativeInsights();
  }
}

// Default qualitative insights
function getDefaultQualitativeInsights(): QualitativeInsights {
  return {
    keyQuotes: [
      {
        quote: "Analysis in progress - quotes will be available once processing completes.",
        context: "System message",
        sentiment: 'neutral',
        topic: 'general',
        source_query: 'System'
      }
    ],
    themes: [
      {
        theme: "Analysis in progress",
        mentions: 1,
        sentiment: 'neutral',
        examples: ["Processing responses..."]
      }
    ],
    strengthsWeaknesses: {
      strengths: ["Analysis in progress"],
      weaknesses: ["Analysis in progress"],
      opportunities: ["Analysis in progress"]
    }
  };
}

// Calculate overall sentiment
function calculateOverallSentiment(metrics: PlatformAnalysis['metrics']): PlatformAnalysis['overallSentiment'] {
  const scores = Object.values(metrics).map(m => m.score);
  const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  
  let sentiment: 'positive' | 'neutral' | 'negative';
  if (averageScore >= 7) sentiment = 'positive';
  else if (averageScore >= 4) sentiment = 'neutral';
  else sentiment = 'negative';
  
  // Calculate confidence based on score distribution
  const variance = scores.reduce((acc, score) => acc + Math.pow(score - averageScore, 2), 0) / scores.length;
  const confidence = Math.max(0.1, Math.min(1.0, 1 - (variance / 10)));
  
  return {
    score: Math.round(averageScore * 10) / 10,
    sentiment,
    confidence: Math.round(confidence * 100) / 100
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: SentimentAnalysisRequest = await request.json();
    const { brandName, queries: customQueries, platforms } = body;

    console.log('Sentiment analysis request:', { brandName, platforms, customQueries: customQueries?.length || 0 });

    if (!brandName?.trim()) {
      return NextResponse.json(
        { error: 'Brand name is required' },
        { status: 400 }
      );
    }

    if (!platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'At least one platform must be specified' },
        { status: 400 }
      );
    }

    const queries = customQueries?.length > 0 ? customQueries : getBrandSentimentQueries(brandName);
    const platformAnalyses: PlatformAnalysis[] = [];

    console.log(`Starting analysis for ${queries.length} queries across ${platforms.length} platforms`);

    // Process platforms in parallel
    const platformPromises = platforms.map(async (platform) => {
      console.log(`Processing platform: ${platform}`);
      const responses = [];
      
      if (platform === 'openai') {
        console.log(`[${platform.toUpperCase()}] Starting ${queries.length} parallel queries...`);
        const queryPromises = queries.map(async (query, index) => {
          console.log(`[${platform.toUpperCase()}] Query ${index + 1}/${queries.length}: ${query.substring(0, 50)}...`);
          try {
            const result = await callOpenAI(query);
            console.log(`[${platform.toUpperCase()}] Query ${index + 1} completed in ${result.processingTime}ms`);
            return {
              query,
              response: result.response,
              processingTime: result.processingTime
            };
          } catch (error) {
            console.error(`[${platform.toUpperCase()}] Query ${index + 1} failed:`, error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
              query,
              response: `Error: Unable to get OpenAI response - ${errorMessage}`,
              processingTime: 0
            };
          }
        });

        const results = await Promise.all(queryPromises);
        responses.push(...results);
        
      } else if (platform === 'grok') {
        console.log(`[${platform.toUpperCase()}] Starting ${queries.length} parallel queries...`);
        const queryPromises = queries.map(async (query, index) => {
          console.log(`[${platform.toUpperCase()}] Query ${index + 1}/${queries.length}: ${query.substring(0, 50)}...`);
          try {
            const result = await callGrok(query);
            console.log(`[${platform.toUpperCase()}] Query ${index + 1} completed in ${result.processingTime}ms (${result.sources?.length || 0} sources)`);
            return {
              query,
              response: result.response,
              sources: result.sources,
              processingTime: result.processingTime
            };
          } catch (error) {
            console.error(`[${platform.toUpperCase()}] Query ${index + 1} failed:`, error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
              query,
              response: `Error: Unable to get Grok response - ${errorMessage}`,
              sources: [],
              processingTime: 0
            };
          }
        });

        const results = await Promise.all(queryPromises);
        responses.push(...results);
      }

      // Analyze sentiment for this platform
      console.log(`[${platform.toUpperCase()}] Starting sentiment analysis...`);
      let metrics;
      try {
        metrics = await analyzeSentiment(responses, brandName);
        console.log(`[${platform.toUpperCase()}] Sentiment analysis completed. Overall score: ${calculateOverallSentiment(metrics).score}`);
      } catch (sentimentError) {
        console.error(`[${platform.toUpperCase()}] Sentiment analysis failed:`, sentimentError);
        metrics = getDefaultMetrics();
      }
      const overallSentiment = calculateOverallSentiment(metrics);

      // Extract qualitative insights
      console.log(`[${platform.toUpperCase()}] Extracting qualitative insights and key quotes...`);
      let qualitativeInsights;
      try {
        qualitativeInsights = await extractQualitativeInsights(responses, brandName);
        console.log(`[${platform.toUpperCase()}] Extracted ${qualitativeInsights.keyQuotes.length} key quotes and ${qualitativeInsights.themes.length} themes`);
      } catch (qualitativeError) {
        console.error(`[${platform.toUpperCase()}] Qualitative analysis failed:`, qualitativeError);
        qualitativeInsights = getDefaultQualitativeInsights();
      }

      return {
        platform,
        responses,
        metrics,
        overallSentiment,
        qualitativeInsights
      };
    });

    // Wait for all platforms to complete
    const platformResults = await Promise.all(platformPromises);
    platformAnalyses.push(...platformResults);

    // Generate comparison analysis
    const comparison = generateComparison(platformAnalyses);

    const result: SentimentAnalysisResponse = {
      brandName,
      platforms: platformAnalyses,
      comparison
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Sentiment analysis API error:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}

function generateComparison(platforms: PlatformAnalysis[]): SentimentAnalysisResponse['comparison'] {
  const averageScores: { [platform: string]: { [metric: string]: number } } = {};
  const metricNames = ['quality', 'value', 'trust', 'customerExperience', 'brandReputation', 'innovation', 'sustainability', 'emotionalConnection'];
  
  // Calculate average scores for each platform
  platforms.forEach(platform => {
    averageScores[platform.platform] = {};
    metricNames.forEach(metric => {
      averageScores[platform.platform][metric] = platform.metrics[metric as keyof typeof platform.metrics].score;
    });
  });

  // Find strongest and weakest metrics across all platforms
  const metricAverages: { [metric: string]: number } = {};
  metricNames.forEach(metric => {
    const scores = platforms.map(p => p.metrics[metric as keyof typeof p.metrics].score);
    metricAverages[metric] = scores.reduce((a, b) => a + b, 0) / scores.length;
  });

  const strongestMetrics = metricNames
    .sort((a, b) => metricAverages[b] - metricAverages[a])
    .slice(0, 3);

  const weakestMetrics = metricNames
    .sort((a, b) => metricAverages[a] - metricAverages[b])
    .slice(0, 3);

  // Generate recommendations
  const recommendations = [];
  
  if (metricAverages.quality < 6) {
    recommendations.push("Focus on improving product quality and reliability messaging");
  }
  if (metricAverages.value < 6) {
    recommendations.push("Better communicate value proposition and pricing benefits");
  }
  if (metricAverages.trust < 6) {
    recommendations.push("Enhance transparency and reliability communications");
  }
  if (metricAverages.sustainability < 6) {
    recommendations.push("Strengthen sustainability and ethical practices messaging");
  }

  // Add platform-specific recommendations
  if (platforms.length > 1) {
    const openai = platforms.find(p => p.platform === 'openai');
    const grok = platforms.find(p => p.platform === 'grok');
    
    if (openai && grok) {
      const openaiAvg = openai.overallSentiment.score;
      const grokAvg = grok.overallSentiment.score;
      
      if (Math.abs(openaiAvg - grokAvg) > 1) {
        if (openaiAvg > grokAvg) {
          recommendations.push("Improve real-time social media presence - Grok shows lower sentiment");
        } else {
          recommendations.push("Focus on formal content optimization - OpenAI shows lower sentiment");
        }
      }
    }
  }

  return {
    averageScores,
    strongestMetrics,
    weakestMetrics,
    recommendations
  };
}