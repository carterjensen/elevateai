import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    // Create legal_compliance_rules table
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS legal_compliance_rules (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          description TEXT,
          rules_content TEXT NOT NULL,
          severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );

        CREATE INDEX IF NOT EXISTS legal_compliance_rules_category_idx ON legal_compliance_rules(category);
        CREATE INDEX IF NOT EXISTS legal_compliance_rules_active_idx ON legal_compliance_rules(is_active);

        -- Create legal_analysis_history table
        CREATE TABLE IF NOT EXISTS legal_analysis_history (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          content_type TEXT NOT NULL CHECK (content_type IN ('text', 'image', 'video')),
          content_hash TEXT NOT NULL,
          analysis_result JSONB NOT NULL,
          compliance_score INTEGER NOT NULL CHECK (compliance_score >= 0 AND compliance_score <= 100),
          violations JSONB DEFAULT '[]',
          warnings JSONB DEFAULT '[]',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );

        CREATE INDEX IF NOT EXISTS legal_analysis_history_type_idx ON legal_analysis_history(content_type);
        CREATE INDEX IF NOT EXISTS legal_analysis_history_score_idx ON legal_analysis_history(compliance_score);
      `
    });

    if (createTableError) {
      console.error('Error creating tables:', createTableError);
      return NextResponse.json(
        { error: 'Failed to create tables', details: createTableError },
        { status: 500 }
      );
    }

    // Insert default legal compliance rules
    const defaultRules = [
      {
        name: 'FDA Health Claims',
        category: 'health',
        description: 'FDA regulations for health and medical claims in advertising',
        rules_content: `FDA Health Claims Compliance:
        - No unsubstantiated health claims
        - Claims must be backed by scientific evidence
        - Avoid terms like "cure", "treat", "prevent" without FDA approval
        - Structure/function claims must include FDA disclaimer
        - No false or misleading health benefits
        - Must comply with FDA guidance on dietary supplements
        - Avoid disease claims without proper approval`,
        severity: 'critical'
      },
      {
        name: 'FTC Truth in Advertising',
        category: 'general',
        description: 'FTC guidelines for truthful and non-deceptive advertising',
        rules_content: `FTC Truth in Advertising:
        - All claims must be truthful and not misleading
        - Substantiation required for all material claims
        - Clear and prominent disclosure of material connections
        - No deceptive pricing or "free" offers with hidden conditions
        - Endorsements must reflect honest opinions and experiences
        - Material terms and conditions must be clearly disclosed
        - No bait-and-switch tactics`,
        severity: 'high'
      },
      {
        name: 'Financial Services Compliance',
        category: 'financial',
        description: 'Regulations for financial services and investment advertising',
        rules_content: `Financial Services Compliance:
        - All investment performance must include risk disclosures
        - No guarantees of investment returns
        - Must include relevant regulatory disclaimers
        - Clear disclosure of fees and charges
        - No misleading statements about past performance
        - Compliance with SEC, FINRA, and state regulations
        - Appropriate risk warnings for investment products`,
        severity: 'critical'
      },
      {
        name: 'Children\'s Advertising (COPPA)',
        category: 'children',
        description: 'COPPA and FTC guidelines for advertising to children',
        rules_content: `Children's Advertising Compliance:
        - No collection of personal info from children under 13 without consent
        - Age-appropriate content and messaging
        - No exploitation of children's inexperience
        - Clear separation between content and advertising
        - No pressure tactics or urgency for children
        - Parental consent requirements clearly stated
        - Educational vs. commercial content distinction`,
        severity: 'high'
      },
      {
        name: 'Alcohol and Tobacco Restrictions',
        category: 'restricted',
        description: 'Federal and state restrictions on alcohol and tobacco advertising',
        rules_content: `Alcohol and Tobacco Restrictions:
        - No targeting of minors or underage audiences
        - Required age verification and warnings
        - No promotion of excessive consumption
        - Compliance with state-specific regulations
        - No health claims for alcoholic beverages
        - Required surgeon general warnings for tobacco
        - Platform-specific restrictions (social media policies)`,
        severity: 'critical'
      },
      {
        name: 'Privacy and Data Protection',
        category: 'privacy',
        description: 'GDPR, CCPA, and privacy law compliance in advertising',
        rules_content: `Privacy and Data Protection:
        - Clear privacy policy and data usage disclosure
        - Opt-in consent for data collection
        - Right to deletion and data portability
        - No deceptive data collection practices
        - Third-party data sharing disclosures
        - Cookies and tracking technology disclosures
        - Cross-border data transfer compliance`,
        severity: 'high'
      }
    ];

    // Insert default rules
    const { error: insertError } = await supabase
      .from('legal_compliance_rules')
      .insert(defaultRules);

    if (insertError) {
      console.error('Error inserting default rules:', insertError);
      // Don't fail if rules already exist
    }

    return NextResponse.json({
      success: true,
      message: 'Legal compliance system initialized successfully',
      tables_created: [
        'legal_compliance_rules',
        'legal_analysis_history'
      ],
      default_rules_added: defaultRules.length
    });

  } catch (error) {
    console.error('Legal compliance initialization error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}