import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface LegalRule {
  id?: string;
  name: string;
  category: string;
  description?: string;
  rules_content: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  is_active: boolean;
}

// GET - Fetch all legal compliance rules
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('legal_compliance_rules')
      .select('*')
      .order('category, name');

    if (error) {
      console.error('Error fetching legal rules:', error);
      return NextResponse.json(
        { error: 'Failed to fetch legal rules' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Legal rules fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new legal compliance rule
export async function POST(request: NextRequest) {
  try {
    const body: Omit<LegalRule, 'id'> = await request.json();

    if (!body.name || !body.category || !body.rules_content) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category, rules_content' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('legal_compliance_rules')
      .insert(body)
      .select();

    if (error) {
      console.error('Error creating legal rule:', error);
      return NextResponse.json(
        { error: 'Failed to create legal rule' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data[0] });
  } catch (error) {
    console.error('Legal rule creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update existing legal compliance rule
export async function PUT(request: NextRequest) {
  try {
    const body: LegalRule = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('legal_compliance_rules')
      .update({
        name: body.name,
        category: body.category,
        description: body.description,
        rules_content: body.rules_content,
        severity: body.severity,
        is_active: body.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', body.id)
      .select();

    if (error) {
      console.error('Error updating legal rule:', error);
      return NextResponse.json(
        { error: 'Failed to update legal rule' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data[0] });
  } catch (error) {
    console.error('Legal rule update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete legal compliance rule
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('legal_compliance_rules')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting legal rule:', error);
      return NextResponse.json(
        { error: 'Failed to delete legal rule' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Legal rule deleted successfully' });
  } catch (error) {
    console.error('Legal rule deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}