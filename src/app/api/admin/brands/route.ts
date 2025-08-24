import { NextResponse } from 'next/server';
import { SAMPLE_BRANDS } from '@/lib/sampleData';

export async function GET() {
  // For now, always return the sample brands since DB tables aren't set up
  // This ensures the admin panel shows the demo data immediately
  return NextResponse.json({
    success: true,
    data: SAMPLE_BRANDS,
    message: 'Demo brands loaded (database integration pending)'
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newBrand = {
      id: `custom-${Date.now()}`,
      name: body.name,
      description: body.description || '',
      tone: body.tone || '',
      logo: body.logo || '🏢',
      is_active: body.is_active !== undefined ? body.is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // For demo purposes, just return success
    return NextResponse.json({
      success: true,
      data: newBrand,
      message: 'Brand created successfully (demo mode)'
    });

  } catch (error) {
    console.error('Create brand error:', error);
    return NextResponse.json(
      { error: 'Failed to create brand', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    const updatedBrand = {
      id: body.id,
      name: body.name,
      description: body.description || '',
      tone: body.tone || '',
      logo: body.logo || '🏢',
      is_active: body.is_active !== undefined ? body.is_active : true,
      created_at: body.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // For demo purposes, just return success
    return NextResponse.json({
      success: true,
      data: updatedBrand,
      message: 'Brand updated successfully (demo mode)'
    });

  } catch (error) {
    console.error('Update brand error:', error);
    return NextResponse.json(
      { error: 'Failed to update brand', details: error instanceof Error ? error.message : String(error) },
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
        { error: 'Brand ID is required' },
        { status: 400 }
      );
    }

    // For demo purposes, just return success
    return NextResponse.json({
      success: true,
      message: 'Brand deleted successfully (demo mode)'
    });

  } catch (error) {
    console.error('Delete brand error:', error);
    return NextResponse.json(
      { error: 'Failed to delete brand', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}