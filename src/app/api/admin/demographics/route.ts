import { NextResponse } from 'next/server';
import { SAMPLE_DEMOGRAPHICS } from '@/lib/sampleData';

export async function GET() {
  // For now, always return the sample demographics since DB tables aren't set up
  // This ensures the admin panel shows the demo data immediately
  return NextResponse.json({
    success: true,
    data: SAMPLE_DEMOGRAPHICS,
    message: 'Demo demographics loaded (database integration pending)'
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newDemographic = {
      id: `custom-${Date.now()}`,
      name: body.name,
      description: body.description || '',
      age_range: body.age_range || '',
      characteristics: body.characteristics || [],
      emoji: body.emoji || '👤',
      is_active: body.is_active !== undefined ? body.is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Auto-generate a persona prompt for this new demographic
    try {
      const { generatePersonaPrompt } = await import('@/lib/promptManager');
      await generatePersonaPrompt(newDemographic);
      console.log(`Auto-generated prompt for new demographic: ${newDemographic.name}`);
    } catch (error) {
      console.error('Error generating persona prompt:', error);
      // Continue even if prompt generation fails
    }

    return NextResponse.json({
      success: true,
      data: newDemographic,
      message: 'Demographic created successfully with auto-generated persona prompt'
    });

  } catch (error) {
    console.error('Create demographic error:', error);
    return NextResponse.json(
      { error: 'Failed to create demographic', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    const updatedDemographic = {
      id: body.id,
      name: body.name,
      description: body.description || '',
      age_range: body.age_range || '',
      characteristics: body.characteristics || [],
      is_active: body.is_active !== undefined ? body.is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // For demo purposes, just return success
    return NextResponse.json({
      success: true,
      data: updatedDemographic,
      message: 'Demographic updated successfully (demo mode)'
    });

  } catch (error) {
    console.error('Update demographic error:', error);
    return NextResponse.json(
      { error: 'Failed to update demographic', details: error instanceof Error ? error.message : String(error) },
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
        { error: 'Demographic ID is required' },
        { status: 400 }
      );
    }

    // For demo purposes, just return success
    return NextResponse.json({
      success: true,
      message: 'Demographic deleted successfully (demo mode)'
    });

  } catch (error) {
    console.error('Delete demographic error:', error);
    return NextResponse.json(
      { error: 'Failed to delete demographic', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}