import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch all system prompts
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('system_prompts')
      .select('*')
      .order('type', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching prompts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch prompts', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);

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
    const { id, prompt_template } = body;

    if (!id || !prompt_template) {
      return NextResponse.json(
        { error: 'Missing required fields: id and prompt_template' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('system_prompts')
      .update({
        prompt_template,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating prompt:', error);
      return NextResponse.json(
        { error: 'Failed to update prompt', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Prompt updated successfully',
      data 
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

    const { data, error } = await supabase
      .from('system_prompts')
      .insert({
        name,
        type,
        target_id: target_id || null,
        prompt_template,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating prompt:', error);
      return NextResponse.json(
        { error: 'Failed to create prompt', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Prompt created successfully',
      data 
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

    const { error } = await supabase
      .from('system_prompts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting prompt:', error);
      return NextResponse.json(
        { error: 'Failed to delete prompt', details: error.message },
        { status: 500 }
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