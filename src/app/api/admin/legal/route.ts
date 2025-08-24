import { NextResponse } from 'next/server';
import { SAMPLE_LEGAL_GUIDELINES } from '@/lib/sampleData';

export async function GET() {
  // For now, always return the sample legal guidelines since DB tables aren't set up
  // This ensures the admin panel shows the demo data immediately
  return NextResponse.json({
    success: true,
    data: SAMPLE_LEGAL_GUIDELINES,
    message: 'Demo legal guidelines loaded (database integration pending)'
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newGuideline = {
      id: `custom-${Date.now()}`,
      name: body.name,
      category: body.category || '',
      description: body.description || '',
      rules: body.rules || [],
      severity_levels: body.severity_levels || ['low', 'medium', 'high'],
      compliance_requirements: body.compliance_requirements || [],
      is_active: body.is_active !== undefined ? body.is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // For demo purposes, just return success
    return NextResponse.json({
      success: true,
      data: newGuideline,
      message: 'Legal guideline created successfully (demo mode)'
    });

  } catch (error) {
    console.error('Create legal guideline error:', error);
    return NextResponse.json(
      { error: 'Failed to create legal guideline', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    const updatedGuideline = {
      id: body.id,
      name: body.name,
      category: body.category || '',
      description: body.description || '',
      rules: body.rules || [],
      severity_levels: body.severity_levels || ['low', 'medium', 'high'],
      compliance_requirements: body.compliance_requirements || [],
      is_active: body.is_active !== undefined ? body.is_active : true,
      created_at: body.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // For demo purposes, just return success
    return NextResponse.json({
      success: true,
      data: updatedGuideline,
      message: 'Legal guideline updated successfully (demo mode)'
    });

  } catch (error) {
    console.error('Update legal guideline error:', error);
    return NextResponse.json(
      { error: 'Failed to update legal guideline', details: error instanceof Error ? error.message : String(error) },
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
        { error: 'Legal guideline ID is required' },
        { status: 400 }
      );
    }

    // For demo purposes, just return success
    return NextResponse.json({
      success: true,
      message: 'Legal guideline deleted successfully (demo mode)'
    });

  } catch (error) {
    console.error('Delete legal guideline error:', error);
    return NextResponse.json(
      { error: 'Failed to delete legal guideline', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}