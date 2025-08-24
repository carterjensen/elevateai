import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const demoLegalRules = [
  {
    name: "Truth in Advertising",
    category: "general",
    description: "Advertisements must not contain false, misleading, or deceptive claims",
    rules_content: "All advertising claims must be truthful, substantiated, and not misleading. Claims must be supported by competent and reliable evidence. Avoid exaggerated claims, false testimonials, or misleading comparisons.",
    severity: "high",
    is_active: true
  },
  {
    name: "Endorsement and Testimonial Guidelines",
    category: "testimonials", 
    description: "Proper disclosure and authenticity requirements for endorsements",
    rules_content: "Endorsements must reflect honest opinions and actual experiences. Material connections between advertisers and endorsers must be disclosed clearly. Celebrity endorsements must comply with FTC guidelines.",
    severity: "medium",
    is_active: true
  },
  {
    name: "Healthcare Advertising Standards",
    category: "healthcare",
    description: "Special requirements for medical and health-related claims",
    rules_content: "Health claims must be supported by clinical evidence. Drug advertisements must include risk information and contraindications. Medical device claims must comply with FDA regulations. No false cure claims.",
    severity: "critical",
    is_active: true
  },
  {
    name: "Financial Services Compliance",
    category: "financial",
    description: "Truth in Lending and financial advertising requirements", 
    rules_content: "Interest rates and fees must be clearly disclosed. Credit terms must be accurate and complete. Investment disclaimers required for financial products. Risk disclosures mandatory for investment services.",
    severity: "high",
    is_active: true
  },
  {
    name: "Food and Nutrition Claims",
    category: "food",
    description: "FDA requirements for food and nutritional advertising",
    rules_content: "Nutritional claims must be substantiated by scientific evidence. Organic claims require proper certification. Allergen warnings must be prominent. Health benefits claims need FDA approval or substantiation.",
    severity: "high", 
    is_active: true
  },
  {
    name: "Children's Advertising Protection",
    category: "children",
    description: "COPPA and special protections for advertising to minors",
    rules_content: "Advertising to children under 13 requires parental consent for data collection. Content must be age-appropriate. No exploitation of children's trust. Clear distinction between content and advertising required.",
    severity: "high",
    is_active: true
  },
  {
    name: "Privacy and Data Collection",
    category: "privacy",
    description: "GDPR, CCPA, and privacy law compliance",
    rules_content: "Privacy policies must be clear and accessible. Consent required for data collection and cookies. Users must be able to opt-out. Data usage must match stated purposes. International users require GDPR compliance.",
    severity: "high",
    is_active: true
  },
  {
    name: "Accessibility Requirements",
    category: "accessibility",
    description: "ADA compliance for digital advertising",
    rules_content: "Digital content must be accessible to users with disabilities. Alt text required for images. Video content needs captions. Color contrast must meet WCAG standards. Keyboard navigation must be supported.",
    severity: "medium",
    is_active: true
  },
  {
    name: "Environmental Claims",
    category: "environmental",
    description: "Green marketing and sustainability claims standards",
    rules_content: "Environmental claims must be specific, substantiated, and not misleading. Avoid vague terms like 'eco-friendly' without evidence. Recycling claims must be accurate. Carbon footprint claims need verification.",
    severity: "medium", 
    is_active: true
  },
  {
    name: "Auto Industry Standards",
    category: "automotive",
    description: "Vehicle advertising and safety claim requirements",
    rules_content: "Fuel economy claims must use EPA testing standards. Safety ratings must be current and accurate. Financing offers must include all terms and conditions. Warranty claims must be clearly stated.",
    severity: "medium",
    is_active: true
  }
];

export async function POST() {
  try {
    // Check if rules already exist
    const { data: existingRules, error: checkError } = await supabase
      .from('legal_compliance_rules')
      .select('id')
      .limit(1);

    if (checkError) {
      // Table doesn't exist, return a helpful message
      return NextResponse.json({
        success: false,
        message: 'Legal compliance tables not found in database. Please create the following tables in your Supabase dashboard:',
        tables_needed: [
          'legal_compliance_rules',
          'legal_analysis_history', 
          'legal_clients'
        ],
        sql_example: `
CREATE TABLE legal_compliance_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  rules_content TEXT NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
        error_details: checkError.message
      }, { status: 400 });
    }

    if (existingRules && existingRules.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Demo legal rules already exist',
        count: existingRules.length
      });
    }

    // Insert demo rules
    const { data, error } = await supabase
      .from('legal_compliance_rules')
      .insert(demoLegalRules)
      .select();

    if (error) {
      console.error('Error creating demo legal rules:', error);
      return NextResponse.json(
        { error: 'Failed to create demo legal rules', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Demo legal rules created successfully',
      count: data?.length || 0,
      rules: data?.map(rule => ({ id: rule.id, name: rule.name, category: rule.category }))
    });

  } catch (error) {
    console.error('Error in seed demo rules:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}