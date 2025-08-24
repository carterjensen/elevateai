-- Create legal_compliance_rules table
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

-- Create legal_analysis_history table
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

-- Create legal_clients table for client-specific profiles
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_legal_compliance_rules_active ON legal_compliance_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_legal_compliance_rules_category ON legal_compliance_rules(category);
CREATE INDEX IF NOT EXISTS idx_legal_analysis_history_hash ON legal_analysis_history(content_hash);
CREATE INDEX IF NOT EXISTS idx_legal_analysis_history_type ON legal_analysis_history(content_type);
CREATE INDEX IF NOT EXISTS idx_legal_clients_active ON legal_clients(is_active);