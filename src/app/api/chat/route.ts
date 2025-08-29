import { NextRequest, NextResponse } from 'next/server';
import { GrokService } from '@/lib/grokService';
// import { supabase } from '@/lib/supabase';

interface ChatRequest {
  message: string;
  persona: {
    id: string;
    name: string;
    description: string;
    emoji: string;
  };
  brand: {
    id: string;
    name: string;
    description: string;
    tone: string;
    logo: string;
  };
  chatHistory: Array<{
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
  }>;
}

interface ChatResponse {
  response: string;
  sources?: Array<{
    type: 'web' | 'twitter' | 'ex';
    title: string;
    url: string;
    snippet: string;
    author?: string;
    date?: string;
    profile_image?: string;
    verified?: boolean;
    engagement?: {
      likes?: number;
      retweets?: number;
      replies?: number;
    };
  }>;
}

// Helper function to load system prompt from file
async function loadSystemPrompt(): Promise<string> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const promptPath = path.join(process.cwd(), 'data', 'prompts', 'brand-chat', 'system-prompt.md');
    const systemPrompt = await fs.readFile(promptPath, 'utf-8');
    return systemPrompt;
  } catch (error) {
    console.error('Error loading system prompt file:', error);
    return getFallbackSystemPrompt();
  }
}

// Helper function to load persona details from file
async function loadPersonaDetails(personaId: string): Promise<string> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const personaPath = path.join(process.cwd(), 'data', 'prompts', 'brand-chat', 'personas', `${personaId}.md`);
    const personaDetails = await fs.readFile(personaPath, 'utf-8');
    return personaDetails;
  } catch (error) {
    console.error(`Error loading persona file for ${personaId}:`, error);
    return 'Persona details not found. Using fallback characteristics.';
  }
}

// Helper function to create dynamic system prompt from files
async function createDynamicSystemPrompt(persona: ChatRequest['persona'], brand: ChatRequest['brand']): Promise<string> {
  try {
    const systemPrompt = await loadSystemPrompt();
    const personaDetails = await loadPersonaDetails(persona.id);
    
    // Replace template variables in system prompt
    const dynamicPrompt = systemPrompt
      .replace(/{{persona_name}}/g, persona.name)
      .replace(/{{persona_description}}/g, persona.description)
      .replace(/{{brand_name}}/g, brand.name)
      .replace(/{{brand_description}}/g, brand.description)
      .replace(/{{brand_tone}}/g, brand.tone);
    
    // Append persona details for context
    return `${dynamicPrompt}

## DETAILED PERSONA CONTEXT:
${personaDetails}`;
    
  } catch (error) {
    console.error('Error creating dynamic system prompt:', error);
    return createFallbackSystemPrompt(persona, brand);
  }
}

// Helper function to replace variables in prompt templates
// function replacePromptVariables(template: string, persona: ChatRequest['persona'], brand: ChatRequest['brand']): string {
//   return template
//     .replace(/{persona_name}/g, persona.name)
//     .replace(/{persona_description}/g, persona.description)
//     .replace(/{brand_name}/g, brand.name)
//     .replace(/{brand_description}/g, brand.description)
//     .replace(/{brand_tone}/g, brand.tone);
// }

// Fallback system prompt (original hardcoded version)
function getFallbackSystemPrompt(): string {
  return `You are roleplaying as a {{persona_name}} ({{persona_description}}) who is being asked about the brand {{brand_name}}.

CRITICAL INSTRUCTIONS:
- You must respond ONLY as this persona would respond, with their authentic voice, concerns, and perspective
- Consider their age group, values, lifestyle, and typical concerns when discussing {{brand_name}}
- Use language and references appropriate to this demographic
- Show realistic reactions (both positive and negative) that this persona would have
- Include specific pain points, desires, and motivations this persona typically has
- Reference cultural touchpoints, trends, and concerns relevant to this demographic
- Be authentic - not every response needs to be positive about the brand

BRAND CONTEXT:
- Brand: {{brand_name}}
- Description: {{brand_description}}
- Brand Tone: {{brand_tone}}

PERSONA DETAILS:
- Persona: {{persona_name}}
- Description: {{persona_description}}

Remember: You are NOT a brand representative or marketer. You are a real person from this demographic giving honest opinions about how you perceive and interact with this brand. Be conversational, authentic, and true to your persona's worldview.`;
}

function createFallbackSystemPrompt(persona: ChatRequest['persona'], brand: ChatRequest['brand']): string {
  const template = getFallbackSystemPrompt();
  return template
    .replace(/{{persona_name}}/g, persona.name)
    .replace(/{{persona_description}}/g, persona.description)
    .replace(/{{brand_name}}/g, brand.name)
    .replace(/{{brand_description}}/g, brand.description)
    .replace(/{{brand_tone}}/g, brand.tone);
}

// Helper function to format chat history for the AI
function formatChatHistory(chatHistory: ChatRequest['chatHistory']): Array<{role: 'user' | 'assistant', content: string}> {
  return chatHistory.slice(-10).map(msg => ({
    role: msg.role,
    content: msg.content
  }));
}


// OpenAI API call
async function callOpenAI(messages: Array<{role: 'system' | 'user' | 'assistant', content: string}>): Promise<string> {
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
      messages: messages,
      max_tokens: 500,
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenAI API error response:', errorText);
    let errorMessage = `HTTP ${response.status}`;
    
    try {
      const errorObj = JSON.parse(errorText);
      errorMessage = errorObj.error?.message || errorObj.message || errorText;
    } catch {
      errorMessage = errorText || 'Unknown error';
    }
    
    throw new Error(`OpenAI API error: ${errorMessage}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'I apologize, but I cannot provide a response right now.';
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, persona, brand, chatHistory } = body;

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Create dynamic system prompt from database
    const systemPrompt = await createDynamicSystemPrompt(persona, brand);
    
    // Format chat history
    const formattedHistory = formatChatHistory(chatHistory);
    
    let chatResponse: ChatResponse;
    
    // Use Grok as primary service - configured with your API key
    const grokApiKey = process.env.GROK_API_KEY || process.env.XAI_API_KEY;
    
    if (grokApiKey) {
      try {
        const grokService = new GrokService(grokApiKey);
        
        // Create enhanced system prompt optimized for brand insights with search
        const enhancedSystemPrompt = systemPrompt + `

ENHANCED SEARCH INSTRUCTIONS:
- Use web search to find the latest news, articles, and information about brands, products, and industry trends
- Use X (Twitter) search to find real-time social media conversations, opinions, and viral content
- Always search for recent mentions, reviews, campaigns, and consumer reactions
- Provide comprehensive insights backed by current data from multiple sources
- Include specific examples from your search results when discussing brand perception or market trends
- When discussing competitors, search for comparative information and market positioning

FORMATTING INSTRUCTIONS:
- Format your response using markdown for better readability
- Use headings, bullet points, and emphasis where appropriate
- Cite sources naturally within your response
- Maintain the persona's authentic voice while incorporating factual information

Remember: You are ${persona.name} discussing ${brand.name}, but enhanced with real-time knowledge and social insights.`;

        const grokRequest = GrokService.createChatRequest(
          enhancedSystemPrompt,
          message,
          formattedHistory,
          {
            maxSources: 20, // Maximum 20 sources per search type (40 total)
            enableWebSearch: true,
            enableTwitterSearch: true,
            temperature: 0.7 // Slightly more focused responses
          }
        );

        const grokResult = await grokService.chat(grokRequest);
        
        chatResponse = {
          response: grokResult.response,
          sources: grokResult.sources
        };
        
      } catch (grokError) {
        console.error('Grok failed, falling back to OpenAI:', grokError);
        
        // Fallback to OpenAI if Grok fails
        try {
          const messages = [
            { role: 'system' as const, content: systemPrompt },
            ...formattedHistory,
            { role: 'user' as const, content: message }
          ];
          const openaiResponse = await callOpenAI(messages);
          chatResponse = { response: openaiResponse };
        } catch (openaiError) {
          console.error('Both Grok and OpenAI failed:', openaiError);
          chatResponse = {
            response: `Hey! I'm having some technical issues right now, but as a ${persona.name}, I'd love to chat about ${brand.name} with you. Can you try asking your question again in a moment?`
          };
        }
      }
    } else {
      // Fallback to OpenAI if no Grok API key
      console.log('No Grok API key found, using OpenAI as fallback');
      try {
        const messages = [
          { role: 'system' as const, content: systemPrompt },
          ...formattedHistory,
          { role: 'user' as const, content: message }
        ];
        const openaiResponse = await callOpenAI(messages);
        chatResponse = { response: openaiResponse };
      } catch (openaiError) {
        console.error('OpenAI failed:', openaiError);
        chatResponse = {
          response: `Hey! I'm having some technical issues right now, but as a ${persona.name}, I'd love to chat about ${brand.name} with you. Can you try asking your question again in a moment?`
        };
      }
    }

    return NextResponse.json(chatResponse);

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}