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

export default function LegalLens() {
  const [analysisType, setAnalysisType] = useState<'text' | 'image' | 'video'>('text');
  const [textContent, setTextContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
          filename
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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">ElevateAI</h1>
              </Link>
              <span className="text-gray-400 mx-2">/</span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-purple-600 font-semibold">LegalLens</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors">
                Admin
              </Link>
              <Link href="/admin/legal" className="text-gray-600 hover:text-purple-600 transition-colors">
                Legal Admin
              </Link>
              <Link href="/superadmin" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold">
                Super Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
            🏛️ Legal Compliance Analysis
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            LegalLens
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Analyze your advertising content against legal compliance rules. Get instant feedback with a compliance score out of 100.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
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
              className="w-full py-3 px-6 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Analyzing...
                </div>
              ) : (
                'Analyze Content'
              )}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  <span className="font-semibold">Analysis Error:</span>
                </div>
                <p className="mt-1 text-red-700">{error}</p>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Compliance Analysis</h2>
              {result && (
                <button
                  onClick={resetAnalysis}
                  className="text-gray-600 hover:text-gray-800 text-sm"
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
      </div>
    </div>
  );
}