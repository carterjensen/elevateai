-- Demographics table
CREATE TABLE IF NOT EXISTS demographics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  age_range TEXT,
  characteristics TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brands table
CREATE TABLE IF NOT EXISTS brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT,
  tone TEXT,
  logo TEXT,
  brand_values TEXT[] DEFAULT '{}',
  target_demographics UUID[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ad analyses table
CREATE TABLE IF NOT EXISTS ad_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES brands(id),
  image_url TEXT NOT NULL,
  target_demographics UUID[] DEFAULT '{}',
  overall_score FLOAT,
  demographic_scores JSONB DEFAULT '{}',
  strengths TEXT[] DEFAULT '{}',
  weaknesses TEXT[] DEFAULT '{}',
  suggestions TEXT[] DEFAULT '{}',
  brand_alignment FLOAT,
  emotional_impact FLOAT,
  clarity FLOAT,
  visual_appeal FLOAT,
  detailed_analysis TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_demographics_active ON demographics(is_active);
CREATE INDEX IF NOT EXISTS idx_brands_active ON brands(is_active);
CREATE INDEX IF NOT EXISTS idx_ad_analyses_brand ON ad_analyses(brand_id);
CREATE INDEX IF NOT EXISTS idx_ad_analyses_created ON ad_analyses(created_at);

-- Insert sample demographics
INSERT INTO demographics (name, description, age_range, characteristics, is_active) VALUES
  ('Gen Z', 'Digital natives who value authenticity and social consciousness', '18-26', ARRAY['Digital native', 'Values authenticity', 'Socially conscious', 'Short attention span', 'Visual learners'], true),
  ('Millennials', 'Tech-savvy generation focused on experiences and work-life balance', '27-42', ARRAY['Tech-savvy', 'Experience-focused', 'Values work-life balance', 'Brand loyal', 'Social media active'], true),
  ('Gen X', 'Independent generation with strong purchasing power', '43-58', ARRAY['Independent', 'High purchasing power', 'Family-oriented', 'Brand skeptical', 'Value quality'], true),
  ('Baby Boomers', 'Traditional generation with established financial stability', '59-77', ARRAY['Traditional values', 'Financial stability', 'Quality focused', 'Brand loyal', 'Detail-oriented'], true)
ON CONFLICT (name) DO NOTHING;

-- Insert sample brands
INSERT INTO brands (name, description, industry, tone, logo, brand_values, target_demographics, is_active) VALUES
  ('Apple', 'Premium technology company known for innovative design and user experience', 'Technology', 'Sleek, innovative, premium', '🍎', ARRAY['Innovation', 'Design', 'Quality', 'Simplicity'], ARRAY[], true),
  ('Nike', 'Athletic apparel and footwear company inspiring athletes worldwide', 'Sports & Athletic', 'Motivational, energetic, empowering', '👟', ARRAY['Performance', 'Innovation', 'Inspiration', 'Excellence'], ARRAY[], true),
  ('Tesla', 'Electric vehicle and clean energy company revolutionizing transportation', 'Automotive/Energy', 'Futuristic, sustainable, disruptive', '⚡', ARRAY['Sustainability', 'Innovation', 'Performance', 'Future-thinking'], ARRAY[], true)
ON CONFLICT (name) DO NOTHING;

-- Create storage bucket for images (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security policies
ALTER TABLE demographics ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_analyses ENABLE ROW LEVEL SECURITY;

-- Allow public read access to demographics and brands
CREATE POLICY "Allow public read access on demographics" ON demographics
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on brands" ON brands
  FOR SELECT USING (true);

-- Allow public access to ad_analyses (for demo purposes - in production, you'd want proper auth)
CREATE POLICY "Allow public read access on ad_analyses" ON ad_analyses
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access on ad_analyses" ON ad_analyses
  FOR INSERT WITH CHECK (true);

-- Allow public write access to demographics and brands for admin functionality
-- (In production, you'd want proper authentication here)
CREATE POLICY "Allow public write access on demographics" ON demographics
  FOR ALL USING (true);

CREATE POLICY "Allow public write access on brands" ON brands
  FOR ALL USING (true);

-- Create storage policy for images
CREATE POLICY "Allow public upload to images bucket"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'images');

CREATE POLICY "Allow public read from images bucket"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'images');