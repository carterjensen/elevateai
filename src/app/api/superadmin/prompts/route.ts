import { NextRequest, NextResponse } from 'next/server';
import { loadActivePrompts } from '@/lib/promptManager';

// GET - Fetch all system prompts
export async function GET() {
  try {
    const prompts = await loadActivePrompts();
    
    // Sort by type, then by name
    const sortedPrompts = [...prompts].sort((a, b) => {
      if (a.type !== b.type) {
        return a.type.localeCompare(b.type);
      }
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json(sortedPrompts);

  } catch (error) {
    console.error('GET prompts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update a system prompt
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, prompt_template, name, type, target_id, is_active } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    const { updatePrompt } = await import('@/lib/promptManager');
    
    const updatedPrompt = await updatePrompt(id, {
      prompt_template,
      name,
      type,
      target_id,
      is_active
    });

    if (!updatedPrompt) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Prompt updated successfully',
      data: updatedPrompt
    });

  } catch (error) {
    console.error('PUT prompt error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new system prompt
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, target_id, prompt_template } = body;

    if (!name || !type || !prompt_template) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type, and prompt_template' },
        { status: 400 }
      );
    }

    if (!['system', 'persona', 'brand'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be system, persona, or brand' },
        { status: 400 }
      );
    }

    const { createPrompt } = await import('@/lib/promptManager');
    
    const newPrompt = await createPrompt({
      name,
      type,
      target_id: target_id || null,
      prompt_template,
      is_active: true
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Prompt created successfully',
      data: newPrompt
    });

  } catch (error) {
    console.error('POST prompt error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a system prompt
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing prompt ID' },
        { status: 400 }
      );
    }

    const { deletePrompt } = await import('@/lib/promptManager');
    
    const deleted = await deletePrompt(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Prompt deleted successfully' 
    });

  } catch (error) {
    console.error('DELETE prompt error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}