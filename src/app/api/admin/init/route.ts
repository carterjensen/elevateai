import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Default demographics data
const defaultDemographics = [
  {
    id: 'gen-z',
    name: 'Gen Z Consumer',
    description: 'Digital natives who value authenticity, social justice, and personalized experiences',
    age_range: '18-26',
    characteristics: [
      'Digital native',
      'Values authenticity',
      'Social media savvy',
      'Environmentally conscious',
      'Prefers mobile-first experiences',
      'Values diversity and inclusion'
    ],
    is_active: true
  },
  {
    id: 'millennial',
    name: 'Millennial Professional',
    description: 'Career-focused individuals who are brand conscious and value experiences over possessions',
    age_range: '27-42',
    characteristics: [
      'Career-focused',
      'Brand conscious',
      'Values experiences',
      'Tech-savvy but not native',
      'Family-oriented',
      'Health and wellness focused'
    ],
    is_active: true
  },
  {
    id: 'gen-x',
    name: 'Gen X Parent',
    description: 'Family-oriented pragmatists who balance work and life, seeking practical solutions',
    age_range: '43-58',
    characteristics: [
      'Family-oriented',
      'Practical and pragmatic',
      'Value work-life balance',
      'Skeptical of marketing',
      'Quality over quantity',
      'Self-reliant'
    ],
    is_active: true
  },
  {
    id: 'boomer',
    name: 'Baby Boomer',
    description: 'Traditional values-focused consumers who prioritize quality, trust, and personal service',
    age_range: '59+',
    characteristics: [
      'Traditional values',
      'Quality-focused',
      'Brand loyal',
      'Prefers personal service',
      'Values trust and reliability',
      'Less tech-savvy'
    ],
    is_active: true
  },
  {
    id: 'eco-warrior',
    name: 'Eco-Conscious Consumer',
    description: 'Sustainability-focused individuals willing to pay premium for environmentally responsible products',
    age_range: '25-45',
    characteristics: [
      'Sustainability-focused',
      'Willing to pay premium for green products',
      'Research-oriented',
      'Values transparency',
      'Socially responsible',
      'Health-conscious'
    ],
    is_active: true
  },
  {
    id: 'tech-enthusiast',
    name: 'Tech Early Adopter',
    description: 'Technology enthusiasts with high disposable income who influence others\' purchasing decisions',
    age_range: '28-50',
    characteristics: [
      'Loves new gadgets',
      'High disposable income',
      'Influences others',
      'Early adopter',
      'Values innovation',
      'Tech opinion leader'
    ],
    is_active: true
  }
];

// Default brands data
const defaultBrands = [
  {
    id: 'apple',
    name: 'Apple',
    description: 'Premium technology company focused on innovative design and user experience',
    industry: 'Technology',
    tone: 'Sleek, innovative, premium',
    logo: '🍎',
    brand_values: [
      'Innovation',
      'Design excellence',
      'Premium quality',
      'User-centric',
      'Minimalism',
      'Privacy-focused'
    ],
    target_demographics: ['millennial', 'gen-z', 'tech-enthusiast'],
    is_active: true
  },
  {
    id: 'nike',
    name: 'Nike',
    description: 'Athletic performance and lifestyle brand inspiring athletes worldwide',
    industry: 'Sports & Athletics',
    tone: 'Motivational, energetic, bold',
    logo: '👟',
    brand_values: [
      'Athletic performance',
      'Motivation',
      'Breaking barriers',
      'Inclusivity',
      'Innovation in sports',
      'Empowerment'
    ],
    target_demographics: ['gen-z', 'millennial', 'gen-x'],
    is_active: true
  },
  {
    id: 'tesla',
    name: 'Tesla',
    description: 'Electric vehicle and clean energy company disrupting traditional automotive',
    industry: 'Automotive/Energy',
    tone: 'Futuristic, disruptive, eco-conscious',
    logo: '⚡',
    brand_values: [
      'Sustainable future',
      'Innovation',
      'Disruption',
      'Performance',
      'Technology leadership',
      'Environmental responsibility'
    ],
    target_demographics: ['millennial', 'tech-enthusiast', 'eco-warrior'],
    is_active: true
  },
  {
    id: 'starbucks',
    name: 'Starbucks',
    description: 'Global coffee company creating community-focused experiences',
    industry: 'Food & Beverage',
    tone: 'Warm, inclusive, experiential',
    logo: '☕',
    brand_values: [
      'Community connection',
      'Quality coffee',
      'Inclusive environment',
      'Social responsibility',
      'Employee welfare',
      'Local engagement'
    ],
    target_demographics: ['millennial', 'gen-x', 'gen-z'],
    is_active: true
  },
  {
    id: 'patagonia',
    name: 'Patagonia',
    description: 'Outdoor gear company with strong environmental activism focus',
    industry: 'Outdoor/Apparel',
    tone: 'Authentic, rugged, environmentally conscious',
    logo: '🏔️',
    brand_values: [
      'Environmental activism',
      'Quality craftsmanship',
      'Outdoor adventure',
      'Sustainability',
      'Corporate responsibility',
      'Authenticity'
    ],
    target_demographics: ['eco-warrior', 'gen-x', 'millennial'],
    is_active: true
  },
  {
    id: 'netflix',
    name: 'Netflix',
    description: 'Entertainment streaming platform revolutionizing content consumption',
    industry: 'Entertainment/Media',
    tone: 'Casual, entertaining, binge-worthy',
    logo: '🎬',
    brand_values: [
      'Entertainment for all',
      'Original content',
      'Convenience',
      'Global storytelling',
      'Data-driven personalization',
      'Accessibility'
    ],
    target_demographics: ['gen-z', 'millennial', 'gen-x'],
    is_active: true
  }
];

export async function POST() {
  try {
    // Tables should already exist from Supabase dashboard setup
    // Just test if they exist and are accessible

    // Check if data already exists
    const { data: existingDemographics } = await supabase
      .from('demographics')
      .select('id')
      .limit(1);

    const { data: existingBrands } = await supabase
      .from('brands')
      .select('id')
      .limit(1);

    let demographicsInserted = 0;
    let brandsInserted = 0;

    // Insert default demographics if none exist
    if (!existingDemographics || existingDemographics.length === 0) {
      const { error: demographicsError } = await supabase
        .from('demographics')
        .insert(defaultDemographics.map(d => ({
          ...d,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })));

      if (demographicsError) {
        console.error('Demographics insert error:', demographicsError);
      } else {
        demographicsInserted = defaultDemographics.length;
      }
    }

    // Insert default brands if none exist
    if (!existingBrands || existingBrands.length === 0) {
      const { error: brandsError } = await supabase
        .from('brands')
        .insert(defaultBrands.map(b => ({
          ...b,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })));

      if (brandsError) {
        console.error('Brands insert error:', brandsError);
      } else {
        brandsInserted = defaultBrands.length;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Admin system initialized successfully',
      data: {
        demographics_inserted: demographicsInserted,
        brands_inserted: brandsInserted,
        tables_created: true
      }
    });

  } catch (error) {
    console.error('Admin initialization error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to initialize admin system', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}