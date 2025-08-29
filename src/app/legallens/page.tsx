'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

interface ComplianceViolation {
  rule_name: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  specific_issue: string;
  recommendation: string;
}

interface ComplianceWarning {
  rule_name: string;
  category: string;
  description: string;
  recommendation: string;
}

interface LegalClient {
  id: string;
  name: string;
  industry: string;
  description: string;
  icon: string;
  compliance_areas: string[];
}

interface AnalysisResult {
  compliance_score: number;
  overall_assessment: string;
  violations: ComplianceViolation[];
  warnings: ComplianceWarning[];
  analysis_summary: string;
  content_type: string;
  filename?: string;
  cached?: boolean;
}

const severityColors = {
  low: 'text-green-600 bg-green-100 border-green-200',
  medium: 'text-yellow-600 bg-yellow-100 border-yellow-200',
  high: 'text-orange-600 bg-orange-100 border-orange-200',
  critical: 'text-red-600 bg-red-100 border-red-200'
};

const scoreColors = {
  excellent: 'text-green-600 bg-green-100',
  good: 'text-blue-600 bg-blue-100',
  warning: 'text-yellow-600 bg-yellow-100',
  danger: 'text-red-600 bg-red-100'
};

function getScoreColor(score: number): keyof typeof scoreColors {
  if (score >= 90) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'warning';
  return 'danger';
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent Compliance';
  if (score >= 70) return 'Good Compliance';
  if (score >= 50) return 'Needs Attention';
  return 'High Risk';
}

// Demo legal clients - in production these would come from database
const demoLegalClients: LegalClient[] = [
  {
    id: 'healthcare-pharma',
    name: 'Healthcare & Pharma',
    industry: 'Healthcare',
    description: 'Medical devices, pharmaceutical products, and health services',
    icon: '🏥',
    compliance_areas: ['FDA regulations', 'HIPAA compliance', 'Medical advertising standards', 'Drug promotion rules']
  },
  {
    id: 'financial-services',
    name: 'Financial Services',
    industry: 'Finance',
    description: 'Banking, insurance, investment services, and fintech',
    icon: '🏦',
    compliance_areas: ['Truth in Lending', 'Fair Credit Reporting', 'Securities regulations', 'Consumer protection']
  },
  {
    id: 'food-beverage',
    name: 'Food & Beverage',
    industry: 'Consumer Goods',
    description: 'Food products, beverages, and nutritional supplements',
    icon: '🍎',
    compliance_areas: ['Nutritional claims', 'FDA food labeling', 'Organic certification', 'Allergen warnings']
  },
  {
    id: 'automotive',
    name: 'Automotive',
    industry: 'Manufacturing',
    description: 'Vehicle manufacturers and automotive services',
    icon: '🚗',
    compliance_areas: ['Safety standards', 'Fuel economy claims', 'Emissions regulations', 'Warranty disclosures']
  },
  {
    id: 'retail-ecommerce',
    name: 'Retail & E-commerce',
    industry: 'Retail',
    description: 'Online and offline retail, consumer products',
    icon: '🛒',
    compliance_areas: ['Consumer protection', 'Privacy policies', 'Return policies', 'Advertising standards']
  },
  {
    id: 'general-business',
    name: 'General Business',
    industry: 'General',
    description: 'Standard business advertising and marketing compliance',
    icon: '🏢',
    compliance_areas: ['FTC guidelines', 'Truth in advertising', 'Endorsement rules', 'Privacy regulations']
  }
];

export default function LegalLens() {
  const [analysisType, setAnalysisType] = useState<'text' | 'image' | 'video'>('text');
  const [textContent, setTextContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedClient, setSelectedClient] = useState<LegalClient>(demoLegalClients[5]); // Default to General Business
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (analysisType === 'image') {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
    } else if (analysisType === 'video') {
      if (!file.type.startsWith('video/')) {
        alert('Please select a video file');
        return;
      }
    }

    setSelectedFile(file);
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Analyze content
  const analyzeContent = async () => {
    if (analysisType === 'text' && !textContent.trim()) {
      alert('Please enter text content to analyze');
      return;
    }

    if ((analysisType === 'image' || analysisType === 'video') && !selectedFile) {
      alert(`Please select a ${analysisType} file to analyze`);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let content = '';
      let filename = '';

      if (analysisType === 'text') {
        content = textContent;
      } else if (selectedFile) {
        filename = selectedFile.name;
        if (analysisType === 'image') {
          const base64 = await fileToBase64(selectedFile);
          content = base64;
        } else if (analysisType === 'video') {
          // For video, we'll pass the filename and size info
          content = `video:${selectedFile.name}:${selectedFile.size}`;
        }
      }

      const response = await fetch('/api/legallens/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: analysisType,
          content,
          filename,
          clientId: selectedClient.id,
          clientProfile: selectedClient
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const data = await response.json();
      setResult(data.data);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  // Reset analysis
  const resetAnalysis = () => {
    setResult(null);
    setError(null);
    setTextContent('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <nav className="nav-primary border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Brand and client dropdown */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <h1 className="text-xl font-bold">ElevateAI</h1>
              </Link>
              
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-purple-600 font-semibold">LegalLens</span>
              </div>

              {/* Client Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowClientDropdown(!showClientDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors border-2 border-purple-200"
                >
                  <span>{selectedClient.icon}</span>
                  <span className="font-medium">{selectedClient.name}</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
                
                {showClientDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-20">
                    <div className="p-2 max-h-96 overflow-y-auto">
                      <div className="text-sm font-semibold text-gray-900 px-3 py-2">Choose Legal Profile</div>
                      {demoLegalClients.map((client) => (
                        <button
                          key={client.id}
                          onClick={() => {
                            setSelectedClient(client);
                            setShowClientDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors ${
                            selectedClient.id === client.id ? 'bg-purple-50 border-l-4 border-purple-400' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xl">{client.icon}</span>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{client.name}</div>
                              <div className="text-sm text-gray-600">{client.description}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                Areas: {client.compliance_areas.slice(0, 3).join(', ')}
                                {client.compliance_areas.length > 3 && ` +${client.compliance_areas.length - 3} more`}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                      <div className="border-t border-gray-200 mt-2 pt-2">
                        <Link 
                          href="/admin/legal" 
                          onClick={() => setShowClientDropdown(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add New Legal Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Navigation */}
            <div className="flex items-center gap-6">
              <Link href="/brandchat" className="nav-link">BrandChat</Link>
              <Link href="/ad-critic" className="nav-link">AdCritic</Link>
              <Link href="/admin" className="nav-link">Admin</Link>
              <Link href="/admin/legal" className="nav-link">Legal Admin</Link>
              <Link href="/superadmin" className="btn btn-secondary text-sm">Super Admin</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
            🏛️ Legal Compliance Analysis
          </div>
          <h1 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              LegalLens
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Analyze your advertising content against <span className="font-semibold text-purple-600">{selectedClient.name}</span> legal compliance rules.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
            <span>Compliance Areas:</span>
            {selectedClient.compliance_areas.slice(0, 4).map((area) => (
              <span key={area} className="px-2 py-1 bg-purple-50 text-purple-600 rounded-full">
                {area}
              </span>
            ))}
            {selectedClient.compliance_areas.length > 4 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded-full">
                +{selectedClient.compliance_areas.length - 4} more
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Content Analysis</h2>

            {/* Content Type Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Content Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['text', 'image', 'video'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setAnalysisType(type);
                      resetAnalysis();
                    }}
                    className={`p-3 text-sm font-medium rounded-lg border-2 transition-colors ${
                      analysisType === type
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      {type === 'text' && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-1a1 1 0 00-1-1H9a1 1 0 00-1 1v1a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
                        </svg>
                      )}
                      {type === 'image' && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                        </svg>
                      )}
                      {type === 'video' && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                        </svg>
                      )}
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Input */}
            <div className="mb-6">
              {analysisType === 'text' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Text Content
                  </label>
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your advertising copy, marketing text, or other content to analyze for legal compliance..."
                  />
                  <div className="mt-2 text-sm text-gray-500">
                    {textContent.length} characters
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {analysisType === 'image' ? 'Image File' : 'Video File'}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={analysisType === 'image' ? 'image/*' : 'video/*'}
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    
                    {selectedFile ? (
                      <div className="space-y-2">
                        <div className="text-green-600 font-semibold">{selectedFile.name}</div>
                        <div className="text-sm text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="text-purple-600 hover:text-purple-700 text-sm"
                        >
                          Change File
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="text-gray-600">
                          Click to upload {analysisType === 'image' ? 'an image' : 'a video'}
                        </div>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Select File
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Analyze Button */}
            <button
              onClick={analyzeContent}
              disabled={loading}
              className="btn btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Analyzing Content...
                </div>
              ) : (
                'Analyze Content →'
              )}
            </button>

            {error && (
              <div className="card mt-6 p-6 border-l-4 border-red-500 bg-red-50">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  <div>
                    <div className="font-semibold text-red-800">Analysis Error</div>
                    <div className="text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="card p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Compliance Analysis</h2>
              {result && (
                <button
                  onClick={resetAnalysis}
                  className="btn btn-ghost text-sm"
                >
                  Clear Results
                </button>
              )}
            </div>

            {result ? (
              <div className="space-y-6">
                {/* Compliance Score */}
                <div className="text-center p-6 border rounded-lg">
                  <div className={`text-6xl font-bold mb-2 ${scoreColors[getScoreColor(result.compliance_score)]}`}>
                    {result.compliance_score}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">out of 100</div>
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${scoreColors[getScoreColor(result.compliance_score)]}`}>
                    {getScoreLabel(result.compliance_score)}
                  </div>
                  {result.cached && (
                    <div className="mt-2 text-xs text-gray-500">
                      ⚡ Cached result
                    </div>
                  )}
                </div>

                {/* Overall Assessment */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Overall Assessment</h3>
                  <p className="text-gray-600">{result.overall_assessment}</p>
                </div>

                {/* Violations */}
                {result.violations && result.violations.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      ⚠️ Violations ({result.violations.length})
                    </h3>
                    <div className="space-y-3">
                      {result.violations.map((violation, index) => (
                        <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-red-900">{violation.rule_name}</h4>
                            <span className={`px-2 py-1 text-xs font-semibold rounded border ${severityColors[violation.severity]}`}>
                              {violation.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-red-800 text-sm mb-2">{violation.description}</p>
                          <div className="text-sm">
                            <div className="text-red-700 mb-1">
                              <strong>Issue:</strong> {violation.specific_issue}
                            </div>
                            <div className="text-red-700">
                              <strong>Fix:</strong> {violation.recommendation}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Warnings */}
                {result.warnings && result.warnings.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      ⚠️ Warnings ({result.warnings.length})
                    </h3>
                    <div className="space-y-3">
                      {result.warnings.map((warning, index) => (
                        <div key={index} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                          <h4 className="font-semibold text-yellow-900 mb-1">{warning.rule_name}</h4>
                          <p className="text-yellow-800 text-sm mb-2">{warning.description}</p>
                          <div className="text-sm text-yellow-700">
                            <strong>Recommendation:</strong> {warning.recommendation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Analysis Summary */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Detailed Analysis</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 text-sm leading-relaxed">{result.analysis_summary}</p>
                  </div>
                </div>

                {/* No Issues */}
                {result.violations.length === 0 && result.warnings.length === 0 && (
                  <div className="text-center p-6 border border-green-200 rounded-lg bg-green-50">
                    <div className="text-green-600 mb-2">
                      <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-green-900 mb-1">No Issues Found!</h3>
                    <p className="text-green-700 text-sm">Your content appears to be compliant with all active legal rules.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 64 64">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.818 2.472c.231-.4.231-.85 0-1.272L19.27 8.318a1.5 1.5 0 00-2.54 0l-1.548 2.884c-.231.422-.231.872 0 1.294L16.73 15.38a1.5 1.5 0 002.54 0l1.548-2.908zM21 16l-2.5-1.5"/>
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Analyze</h3>
                <p className="text-gray-600">
                  Select your content type and provide the content to get started with legal compliance analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}