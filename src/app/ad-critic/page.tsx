'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Brand {
  id: string;
  name: string;
  description: string;
  industry: string;
  tone: string;
  logo: string;
  brand_values: string[];
}

interface Demographic {
  id: string;
  name: string;
  description: string;
  age_range: string;
  characteristics: string[];
}

interface AnalysisResult {
  id?: string;
  overall_score: number;
  demographic_scores: { [key: string]: number };
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  brand_alignment: number;
  emotional_impact: number;
  clarity: number;
  visual_appeal: number;
  detailed_analysis: string;
  brand: Brand;
  demographics: Demographic[];
}

export default function AdCritic() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [demographics, setDemographics] = useState<Demographic[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedDemographics, setSelectedDemographics] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load brands
      const { data: brandsData, error: brandsError } = await supabase
        .from('brands')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (brandsError) throw brandsError;

      // Load demographics
      const { data: demographicsData, error: demographicsError } = await supabase
        .from('demographics')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (demographicsError) throw demographicsError;

      setBrands(brandsData || []);
      setDemographics(demographicsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load brands and demographics');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setImageUrl(''); // Clear URL input when file is uploaded
    }
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    setPreviewUrl(url);
    setImageFile(null); // Clear file when URL is provided
  };

  const toggleDemographic = (demographicId: string) => {
    setSelectedDemographics(prev => {
      if (prev.includes(demographicId)) {
        return prev.filter(id => id !== demographicId);
      } else {
        return [...prev, demographicId];
      }
    });
  };

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    const fileName = `ad-images/${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, file);

    if (error) {
      throw new Error('Failed to upload image: ' + error.message);
    }

    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const analyzeAd = async () => {
    if (!selectedBrand || selectedDemographics.length === 0) {
      setError('Please select a brand and at least one demographic');
      return;
    }

    if (!imageUrl && !imageFile) {
      setError('Please provide an image URL or upload an image');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      let finalImageUrl = imageUrl;

      // Upload file to Supabase if provided
      if (imageFile) {
        finalImageUrl = await uploadImageToSupabase(imageFile);
      }

      const response = await fetch('/api/analyze-ad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: finalImageUrl,
          brandId: selectedBrand,
          demographicIds: selectedDemographics,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze advertisement');
      }

      setAnalysisResult(result.analysis);
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error instanceof Error ? error.message : 'Failed to analyze advertisement');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setImageUrl('');
    setImageFile(null);
    setPreviewUrl('');
    setSelectedBrand('');
    setSelectedDemographics([]);
    setError('');
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 8) return 'bg-green-100';
    if (score >= 6) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              ← Back to Platform
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">AI Ad Critic</h1>
            <span className="text-sm text-gray-500">Powered by OpenAI Vision</span>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Admin Panel
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!analysisResult ? (
          /* Analysis Setup */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image Upload */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Advertisement</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image File
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="text-center text-gray-500 text-sm">— OR —</div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {previewUrl && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview
                    </label>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Brand Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Brand</h2>
              
              <div className="space-y-3">
                {brands.map((brand) => (
                  <label key={brand.id} className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="brand"
                      value={brand.id}
                      checked={selectedBrand === brand.id}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{brand.logo}</span>
                        <span className="font-medium text-gray-900">{brand.name}</span>
                      </div>
                      <div className="text-sm text-gray-600">{brand.industry}</div>
                      <div className="text-sm text-gray-500 italic">{brand.tone}</div>
                    </div>
                  </label>
                ))}
                
                {brands.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No brands available. <Link href="/admin/brands" className="text-blue-600">Create some first</Link>.
                  </div>
                )}
              </div>
            </div>

            {/* Demographics Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Target Demographics</h2>
              <p className="text-sm text-gray-600 mb-4">Select all demographics you want to analyze for</p>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {demographics.map((demographic) => (
                  <label key={demographic.id} className="flex items-start p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedDemographics.includes(demographic.id)}
                      onChange={() => toggleDemographic(demographic.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    />
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-gray-900">{demographic.name}</div>
                      <div className="text-sm text-gray-600">{demographic.age_range}</div>
                      <div className="text-sm text-gray-500">{demographic.description}</div>
                    </div>
                  </label>
                ))}
                
                {demographics.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No demographics available. <Link href="/admin/demographics" className="text-blue-600">Create some first</Link>.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Analysis Results */
          <div className="space-y-8">
            {/* Header with analyzed image */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start gap-6">
                <img
                  src={previewUrl}
                  alt="Analyzed Advertisement"
                  className="w-64 h-48 object-cover rounded-lg border border-gray-200"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Complete</h2>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{analysisResult.brand.logo}</span>
                    <span className="text-xl font-semibold">{analysisResult.brand.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {analysisResult.demographics.map((demo) => (
                      <span key={demo.id} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {demo.name}
                      </span>
                    ))}
                  </div>
                  <div className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold text-lg ${getScoreBackground(analysisResult.overall_score)} ${getScoreColor(analysisResult.overall_score)}`}>
                    Overall Score: {analysisResult.overall_score}/10
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <div className={`text-3xl font-bold ${getScoreColor(analysisResult.brand_alignment)}`}>
                  {analysisResult.brand_alignment}/10
                </div>
                <div className="text-sm font-medium text-gray-700 mt-2">Brand Alignment</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <div className={`text-3xl font-bold ${getScoreColor(analysisResult.emotional_impact)}`}>
                  {analysisResult.emotional_impact}/10
                </div>
                <div className="text-sm font-medium text-gray-700 mt-2">Emotional Impact</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <div className={`text-3xl font-bold ${getScoreColor(analysisResult.clarity)}`}>
                  {analysisResult.clarity}/10
                </div>
                <div className="text-sm font-medium text-gray-700 mt-2">Message Clarity</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <div className={`text-3xl font-bold ${getScoreColor(analysisResult.visual_appeal)}`}>
                  {analysisResult.visual_appeal}/10
                </div>
                <div className="text-sm font-medium text-gray-700 mt-2">Visual Appeal</div>
              </div>
            </div>

            {/* Demographic Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Demographic Appeal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysisResult.demographics.map((demo) => {
                  const score = analysisResult.demographic_scores[demo.id] || 0;
                  return (
                    <div key={demo.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{demo.name}</span>
                        <span className={`font-bold ${getScoreColor(score)}`}>{score}/10</span>
                      </div>
                      <div className="text-sm text-gray-600">{demo.age_range}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Feedback Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Strengths */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
                  ✅ Strengths
                </h3>
                <ul className="space-y-3">
                  {analysisResult.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
                  ⚠️ Areas for Improvement
                </h3>
                <ul className="space-y-3">
                  {analysisResult.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span className="text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggestions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                  💡 Suggestions
                </h3>
                <ul className="space-y-3">
                  {analysisResult.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span className="text-gray-700">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Analysis</h3>
              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                {analysisResult.detailed_analysis}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="text-red-800">{error}</div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-8">
          {!analysisResult ? (
            <button
              onClick={analyzeAd}
              disabled={isAnalyzing || !selectedBrand || selectedDemographics.length === 0 || (!imageUrl && !imageFile)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              {isAnalyzing ? 'Analyzing Advertisement...' : 'Analyze Advertisement'}
            </button>
          ) : (
            <button
              onClick={resetAnalysis}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Analyze Another Ad
            </button>
          )}
        </div>
      </div>
    </div>
  );
}