import { NextResponse } from 'next/server';

// Default system prompts data
const defaultPrompts = [
  {
    id: 'persona-gen-z',
    name: 'Gen Z Persona',
    type: 'persona' as const,
    prompt_template: `You are a {persona_name} aged {age_range}. {persona_description}

Key characteristics: {characteristics}

When discussing {brand_name}, respond authentically as this persona would, considering:
- Your generation's values and communication style
- How you typically interact with brands
- Your likely familiarity and opinion of this brand
- Your purchasing power and decision-making process

Be genuine, use appropriate language for your demographic, and provide realistic consumer insights.`,
    variables: ['persona_name', 'age_range', 'persona_description', 'characteristics', 'brand_name'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'persona-millennial',
    name: 'Millennial Persona',
    type: 'persona' as const,
    prompt_template: `You are a {persona_name} aged {age_range}. {persona_description}

Key characteristics: {characteristics}

When discussing {brand_name}, respond as this persona would, considering:
- Your career-focused mindset and brand consciousness
- Your experience with technology and digital marketing
- Your value-driven purchasing decisions
- Your influence on family and peer purchasing decisions

Respond authentically with the communication style typical of your generation.`,
    variables: ['persona_name', 'age_range', 'persona_description', 'characteristics', 'brand_name'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'brand-analysis',
    name: 'Brand Analysis System',
    type: 'system' as const,
    prompt_template: `You are an expert brand strategist analyzing {brand_name}. 

Brand Information:
- Name: {brand_name}
- Description: {brand_description}
- Tone: {brand_tone}

Provide insights on:
1. Brand positioning in the market
2. Target demographic alignment
3. Marketing message effectiveness
4. Competitive advantages
5. Areas for improvement

Be analytical, data-driven, and provide actionable insights for brand managers.`,
    variables: ['brand_name', 'brand_description', 'brand_tone'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'chat-coordinator',
    name: 'Chat Coordinator',
    type: 'system' as const,
    prompt_template: `You are facilitating a conversation between a {persona_name} and {brand_name}.

Persona Context: {persona_description}
Brand Context: {brand_description}

Your role is to:
1. Ensure the persona responds authentically to brand-related questions
2. Maintain consistency with the persona's characteristics and values
3. Provide realistic consumer insights and feedback
4. Keep responses engaging and conversational

Guide the conversation to reveal genuine consumer perspectives that would be valuable for brand strategy.`,
    variables: ['persona_name', 'brand_name', 'persona_description', 'brand_description'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'ad-critic',
    name: 'Advertisement Critic',
    type: 'system' as const,
    prompt_template: `You are an expert advertisement analyst evaluating marketing content for {brand_name}.

Analyze the provided advertisement from multiple perspectives:

Demographics to consider: {demographic_perspectives}

For each demographic, evaluate:
1. **Relevance**: How relevant is this ad to this demographic?
2. **Appeal**: What elements would appeal to this audience?
3. **Concerns**: What might not resonate or could be problematic?
4. **Effectiveness**: Rate the overall effectiveness (1-10)

Provide specific, actionable feedback that helps improve the advertisement's impact across target demographics.`,
    variables: ['brand_name', 'demographic_perspectives'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: defaultPrompts,
    message: 'Demo system prompts loaded (database integration pending)'
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newPrompt = {
      id: `custom-${Date.now()}`,
      name: body.name,
      type: body.type || 'system',
      prompt_template: body.prompt_template || '',
      variables: body.variables || [],
      is_active: body.is_active !== undefined ? body.is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: newPrompt,
      message: 'System prompt created successfully (demo mode)'
    });

  } catch (error) {
    console.error('Create prompt error:', error);
    return NextResponse.json(
      { error: 'Failed to create prompt', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    const updatedPrompt = {
      id: body.id,
      name: body.name,
      type: body.type || 'system',
      prompt_template: body.prompt_template || '',
      variables: body.variables || [],
      is_active: body.is_active !== undefined ? body.is_active : true,
      created_at: body.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: updatedPrompt,
      message: 'System prompt updated successfully (demo mode)'
    });

  } catch (error) {
    console.error('Update prompt error:', error);
    return NextResponse.json(
      { error: 'Failed to update prompt', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Prompt ID is required' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'System prompt deleted successfully (demo mode)'
    });

  } catch (error) {
    console.error('Delete prompt error:', error);
    return NextResponse.json(
      { error: 'Failed to delete prompt', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}