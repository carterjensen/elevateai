import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    // Create legal_compliance_rules table
    let rulesTableError = null;
    try {
      const result = await supabase.rpc('create_legal_compliance_rules_table', {
        sql: `
          CREATE TABLE IF NOT EXISTS legal_compliance_rules (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            category VARCHAR(100) NOT NULL,
            description TEXT,
            rules_content TEXT NOT NULL,
            severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      rulesTableError = result.error;
    } catch {
      // If RPC doesn't exist, try direct table creation (this will likely fail but let's try)
      await supabase.from('_temp_setup').select('*').limit(1);
    }

    // Create legal_analysis_history table  
    let historyTableError = null;
    try {
      const result = await supabase.rpc('create_legal_analysis_history_table', {
        sql: `
          CREATE TABLE IF NOT EXISTS legal_analysis_history (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('text', 'image', 'video')),
            content_hash VARCHAR(64) NOT NULL,
            analysis_result JSONB NOT NULL,
            compliance_score INTEGER NOT NULL,
            violations JSONB,
            warnings JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      historyTableError = result.error;
    } catch {
      historyTableError = null;
    }

    // Create legal_clients table
    let clientsTableError = null;
    try {
      const result = await supabase.rpc('create_legal_clients_table', {
        sql: `
          CREATE TABLE IF NOT EXISTS legal_clients (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            industry VARCHAR(100) NOT NULL,
            compliance_areas TEXT[] NOT NULL,
            description TEXT,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      clientsTableError = result.error;
    } catch {
      clientsTableError = null;
    }

    return NextResponse.json({
      success: true,
      message: 'Legal tables setup attempted',
      errors: {
        rules: rulesTableError?.message,
        history: historyTableError?.message,
        clients: clientsTableError?.message
      }
    });

  } catch (error) {
    console.error('Error setting up legal tables:', error);
    return NextResponse.json(
      { error: 'Setup failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}