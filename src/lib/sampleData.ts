// Centralized Sample Data for ElevateAI Platform
// This data should be consistent across all modules and available for admin management

export interface Demographic {
  id: string;
  name: string;
  description: string;
  age_range: string;
  characteristics: string[];
  emoji: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Brand {
  id: string;
  name: string;
  description: string;
  tone: string;
  logo: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LegalGuideline {
  id: string;
  name: string;
  category: string;
  description: string;
  rules: string[];
  severity_levels: string[];
  compliance_requirements: string[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// SAMPLE DEMOGRAPHICS
export const SAMPLE_DEMOGRAPHICS: Demographic[] = [
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
    emoji: '🎮',
    is_active: true,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
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
    emoji: '💼',
    is_active: true,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
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
    emoji: '👨‍👩‍👧‍👦',
    is_active: true,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
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
    emoji: '👴',
    is_active: true,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
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
    emoji: '🌱',
    is_active: true,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
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
    emoji: '🚀',
    is_active: true,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  }
];

// SAMPLE BRANDS
export const SAMPLE_BRANDS: Brand[] = [
  {
    id: 'apple',
    name: 'Apple',
    description: 'Premium technology with minimalist design',
    tone: 'Sleek, innovative, premium',
    logo: '🍎',
    is_active: true,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'nike',
    name: 'Nike',
    description: 'Athletic performance and inspiration',
    tone: 'Motivational, energetic, bold',
    logo: '👟',
    is_active: true,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'tesla',
    name: 'Tesla',
    description: 'Sustainable luxury and innovation',
    tone: 'Futuristic, disruptive, eco-conscious',
    logo: '⚡',
    is_active: true,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'starbucks',
    name: 'Starbucks',
    description: 'Community-focused coffee experience',
    tone: 'Warm, inclusive, experiential',
    logo: '☕',
    is_active: true,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'patagonia',
    name: 'Patagonia',
    description: 'Outdoor gear with environmental activism',
    tone: 'Authentic, rugged, environmentally conscious',
    logo: '🏔️',
    is_active: true,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'netflix',
    name: 'Netflix',
    description: 'Entertainment streaming platform',
    tone: 'Casual, entertaining, binge-worthy',
    logo: '🎬',
    is_active: true,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  }
];

// SAMPLE LEGAL GUIDELINES
export const SAMPLE_LEGAL_GUIDELINES: LegalGuideline[] = [
  {
    id: 'gdpr-compliance',
    name: 'GDPR Data Privacy',
    category: 'Data Privacy',
    description: 'General Data Protection Regulation compliance for EU users',
    rules: [
      'Must have clear consent for data collection',
      'Right to data portability must be provided',
      'Right to be forgotten must be implemented',
      'Data breach notification within 72 hours',
      'Privacy by design and by default',
      'Data minimization principle must be followed'
    ],
    severity_levels: ['low', 'medium', 'high', 'critical'],
    compliance_requirements: [
      'Privacy policy must be clearly visible',
      'Cookie consent banner required',
      'Data processing lawful basis must be established',
      'User rights information must be accessible'
    ],
    is_active: true,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'ccpa-compliance',
    name: 'CCPA Consumer Rights',
    category: 'Data Privacy',
    description: 'California Consumer Privacy Act compliance requirements',
    rules: [
      'Right to know what personal information is collected',
      'Right to delete personal information',
      'Right to opt-out of sale of personal information',
      'Right to non-discrimination for exercising privacy rights',
      'Notice at collection must be provided',
      'Privacy policy must include required disclosures'
    ],
    severity_levels: ['medium', 'high', 'critical'],
    compliance_requirements: [
      'Do Not Sell My Personal Information link required',
      'Consumer request verification process needed',
      'Annual privacy policy updates required',
      'Authorized agent process must be established'
    ],
    is_active: true,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'ftc-advertising',
    name: 'FTC Advertising Standards',
    category: 'Advertising',
    description: 'Federal Trade Commission advertising and endorsement guidelines',
    rules: [
      'All advertising claims must be truthful and substantiated',
      'Material connections must be clearly disclosed',
      'Endorsements must reflect honest opinions and experiences',
      'Native advertising must be clearly labeled',
      'Children\'s advertising has special restrictions',
      'Health claims require scientific evidence'
    ],
    severity_levels: ['low', 'medium', 'high'],
    compliance_requirements: [
      'Influencer partnerships must include #ad or #sponsored',
      'Testimonials must be genuine and representative',
      'Disclaimer text must be clear and conspicuous',
      'Claims substantiation documentation required'
    ],
    is_active: true,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'accessibility-wcag',
    name: 'WCAG Accessibility',
    category: 'Accessibility',
    description: 'Web Content Accessibility Guidelines compliance',
    rules: [
      'Content must be perceivable to all users',
      'Interface must be operable via keyboard',
      'Information must be understandable',
      'Content must be robust across technologies',
      'Alt text required for images',
      'Color cannot be sole method of conveying information'
    ],
    severity_levels: ['low', 'medium', 'high'],
    compliance_requirements: [
      'ARIA labels for interactive elements',
      'Keyboard navigation support required',
      'Screen reader compatibility needed',
      'Color contrast ratios must meet standards'
    ],
    is_active: true,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'coppa-children',
    name: 'COPPA Child Protection',
    category: 'Child Safety',
    description: 'Children\'s Online Privacy Protection Act requirements',
    rules: [
      'Verifiable parental consent required for under 13',
      'No collection of personal info from children without consent',
      'Parents must be notified of information practices',
      'Parents can review child\'s personal information',
      'Parents can refuse further collection or use',
      'Reasonable procedures to protect child data confidentiality'
    ],
    severity_levels: ['high', 'critical'],
    compliance_requirements: [
      'Age verification mechanism required',
      'Parental consent process must be implemented',
      'Child-directed content must be identified',
      'Special privacy protections for mixed audiences'
    ],
    is_active: true,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'can-spam',
    name: 'CAN-SPAM Email Rules',
    category: 'Email Marketing',
    description: 'CAN-SPAM Act requirements for commercial emails',
    rules: [
      'Don\'t use false or misleading header information',
      'Don\'t use deceptive subject lines',
      'Identify the message as an advertisement',
      'Tell recipients where you\'re located',
      'Tell recipients how to opt out of receiving emails',
      'Honor opt-out requests promptly',
      'Monitor what others are doing on your behalf'
    ],
    severity_levels: ['medium', 'high'],
    compliance_requirements: [
      'Clear and conspicuous unsubscribe mechanism',
      'Valid physical postal address required',
      'Opt-out processing within 10 business days',
      'Third-party email practices monitoring needed'
    ],
    is_active: true,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  }
];

// Helper functions to get sample data
export const getSampleDemographics = (): Demographic[] => SAMPLE_DEMOGRAPHICS;
export const getSampleBrands = (): Brand[] => SAMPLE_BRANDS;
export const getSampleLegalGuidelines = (): LegalGuideline[] => SAMPLE_LEGAL_GUIDELINES;

// Helper functions to find specific items
export const findDemographic = (id: string): Demographic | undefined => 
  SAMPLE_DEMOGRAPHICS.find(d => d.id === id);

export const findBrand = (id: string): Brand | undefined => 
  SAMPLE_BRANDS.find(b => b.id === id);

export const findLegalGuideline = (id: string): LegalGuideline | undefined => 
  SAMPLE_LEGAL_GUIDELINES.find(l => l.id === id);