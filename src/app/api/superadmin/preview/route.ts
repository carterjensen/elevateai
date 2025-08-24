import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface PreviewRequest {
  persona_id: string;
  brand_id: string;
}

// Helper function to create dynamic system prompt (copied from chat route)
interface SystemPromptRecord {
  id: string;
  name: string;
  type: 'persona' | 'brand' | 'system';
  target_id: string;
  prompt_template: string;
  is_active: boolean;
}

async function createDynamicSystemPrompt(personaId: string, brandId: string): Promise<{
  combinedPrompt: string;
  systemPrompt: SystemPromptRecord | null;
  personaPrompt: SystemPromptRecord | null;
  brandPrompt: SystemPromptRecord | null;
  finalPrompt: string;
}> {
  try {
    // Get persona and brand details
    const personas = [
      { id: 'gen-z', name: 'Gen Z Consumer', description: 'Ages 18-26, digital native, values authenticity' },
      { id: 'millennial', name: 'Millennial Professional', description: 'Ages 27-42, career-focused, brand conscious' },
      { id: 'gen-x', name: 'Gen X Parent', description: 'Ages 43-58, family-oriented, practical' },
      { id: 'boomer', name: 'Baby Boomer', description: 'Ages 59+, traditional values, quality-focused' },
      { id: 'eco-warrior', name: 'Eco-Conscious Consumer', description: 'Sustainability-focused, willing to pay premium for green products' },
      { id: 'tech-enthusiast', name: 'Tech Early Adopter', description: 'Loves new gadgets, influences others, high disposable income' }
    ];

    const brands = [
      { id: 'apple', name: 'Apple', description: 'Premium technology with minimalist design', tone: 'Sleek, innovative, premium' },
      { id: 'nike', name: 'Nike', description: 'Athletic performance and inspiration', tone: 'Motivational, energetic, bold' },
      { id: 'tesla', name: 'Tesla', description: 'Sustainable luxury and innovation', tone: 'Futuristic, disruptive, eco-conscious' },
      { id: 'starbucks', name: 'Starbucks', description: 'Community-focused coffee experience', tone: 'Warm, inclusive, experiential' },
      { id: 'patagonia', name: 'Patagonia', description: 'Outdoor gear with environmental activism', tone: 'Authentic, rugged, environmentally conscious' },
      { id: 'netflix', name: 'Netflix', description: 'Entertainment streaming platform', tone: 'Casual, entertaining, binge-worthy' }
    ];

    const persona = personas.find(p => p.id === personaId);
    const brand = brands.find(b => b.id === brandId);

    if (!persona || !brand) {
      throw new Error('Persona or brand not found');
    }

    // Fetch system prompts from database
    const { data: systemPrompts, error } = await supabase
      .from('system_prompts')
      .select('*')
      .eq('is_active', true)
      .in('type', ['system', 'persona', 'brand'])
      .in('target_id', ['global', personaId, brandId]);

    if (error) {
      console.error('Error fetching system prompts:', error);
      throw error;
    }

    // Find individual prompts
    const systemPrompt = systemPrompts.find(p => p.type === 'system' && (p.target_id === 'global' || !p.target_id));
    const personaPrompt = systemPrompts.find(p => p.type === 'persona' && p.target_id === personaId);
    const brandPrompt = systemPrompts.find(p => p.type === 'brand' && p.target_id === brandId);

    // Combine prompts in order: system, persona-specific, brand-specific
    let combinedPrompt = '';
    
    if (systemPrompt) {
      combinedPrompt += systemPrompt.prompt_template + '\n\n';
    }
    
    if (personaPrompt) {
      combinedPrompt += personaPrompt.prompt_template + '\n\n';
    }
    
    if (brandPrompt) {
      combinedPrompt += brandPrompt.prompt_template + '\n\n';
    }

    // Replace variables in the combined prompt
    const finalPrompt = combinedPrompt
      .replace(/{persona_name}/g, persona.name)
      .replace(/{persona_description}/g, persona.description)
      .replace(/{brand_name}/g, brand.name)
      .replace(/{brand_description}/g, brand.description)
      .replace(/{brand_tone}/g, brand.tone);

    return {
      combinedPrompt,
      systemPrompt,
      personaPrompt,
      brandPrompt,
      finalPrompt
    };

  } catch (error) {
    console.error('Error creating dynamic system prompt:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: PreviewRequest = await request.json();
    const { persona_id, brand_id } = body;

    if (!persona_id || !brand_id) {
      return NextResponse.json(
        { error: 'Missing persona_id or brand_id' },
        { status: 400 }
      );
    }

    const promptData = await createDynamicSystemPrompt(persona_id, brand_id);

    return NextResponse.json({
      success: true,
      data: {
        persona_id,
        brand_id,
        ...promptData,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Preview API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate prompt preview', details: error },
      { status: 500 }
    );
  }
}