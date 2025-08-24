import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

// Helper function to create dynamic system prompt from prompt manager
async function createDynamicSystemPrompt(persona: ChatRequest['persona'], brand: ChatRequest['brand']): Promise<string> {
  try {
    const { getConversationPrompt } = await import('@/lib/promptManager');
    
    // Get the dynamic prompt for this persona and brand
    const prompt = await getConversationPrompt(
      persona.id,
      brand.name,
      brand.description,
      brand.tone,
      persona.name,
      persona.description
    );
    
    return prompt;

  } catch (error) {
    console.error('Error creating dynamic system prompt:', error);
    return createFallbackSystemPrompt(persona, brand);
  }
}

// Helper function to replace variables in prompt templates
function replacePromptVariables(template: string, persona: ChatRequest['persona'], brand: ChatRequest['brand']): string {
  return template
    .replace(/{persona_name}/g, persona.name)
    .replace(/{persona_description}/g, persona.description)
    .replace(/{brand_name}/g, brand.name)
    .replace(/{brand_description}/g, brand.description)
    .replace(/{brand_tone}/g, brand.tone);
}

// Fallback system prompt (original hardcoded version)
function createFallbackSystemPrompt(persona: ChatRequest['persona'], brand: ChatRequest['brand']): string {
  return `You are roleplaying as a ${persona.name} (${persona.description}) who is being asked about the brand ${brand.name}.

CRITICAL INSTRUCTIONS:
- You must respond ONLY as this persona would respond, with their authentic voice, concerns, and perspective
- Consider their age group, values, lifestyle, and typical concerns when discussing ${brand.name}
- Use language and references appropriate to this demographic
- Show realistic reactions (both positive and negative) that this persona would have
- Include specific pain points, desires, and motivations this persona typically has
- Reference cultural touchpoints, trends, and concerns relevant to this demographic
- Be authentic - not every response needs to be positive about the brand

BRAND CONTEXT:
- Brand: ${brand.name}
- Description: ${brand.description}
- Brand Tone: ${brand.tone}

PERSONA DETAILS:
- Persona: ${persona.name}
- Description: ${persona.description}

Remember: You are NOT a brand representative or marketer. You are a real person from this demographic giving honest opinions about how you perceive and interact with this brand. Be conversational, authentic, and true to your persona's worldview.`;
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
    
    // Prepare messages for AI
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...formattedHistory,
      { role: 'user' as const, content: message }
    ];

    let response: string;
    
    // Use OpenAI
    try {
      response = await callOpenAI(messages);
    } catch (openaiError) {
      console.error('OpenAI failed:', openaiError);
      
      // Fallback response based on persona
      response = `Hey! I'm having some technical issues right now, but as a ${persona.name}, I'd love to chat about ${brand.name} with you. Can you try asking your question again in a moment?`;
    }

    return NextResponse.json({ response });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}