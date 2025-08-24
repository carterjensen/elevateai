'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
// Simple ad critic interface

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
    document.body.style.cursor = 'none';
    return () => {
      document.body.style.cursor = 'auto';
    };
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
      setImageUrl('');
    }
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    setPreviewUrl(url);
    setImageFile(null);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-500 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15.586 13V12a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
          </div>
          <div className="text-2xl font-semibold text-gray-900 mb-2">Loading Ad Critic</div>
          <div className="text-gray-600">Preparing your advertisement analysis tools...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <nav className="nav-primary">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <h1 className="text-xl font-bold">ElevateAI</h1>
              </Link>
              <span className="text-gray-400 mx-2">/</span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15.586 13V12a1 1 0 011-1z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-orange-600 font-semibold">AdCritic</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <Link href="/" className="nav-link">
                Home
              </Link>
              <Link href="/brandchat" className="nav-link">
                BrandChat
              </Link>
              <Link href="/admin" className="nav-link">
                Admin
              </Link>
              <Link href="/superadmin" className="btn btn-secondary text-sm">
                Super Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
              Ad Critic
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get AI-powered analysis of your advertisements with comprehensive demographic insights and actionable recommendations
          </p>
        </div>
          {!analysisResult ? (
            /* Analysis Setup */
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Image Upload */}
                <div className="card hover-lift p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Upload Advertisement</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Upload Image File</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="text-center text-slate-500 text-sm">— OR —</div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Image URL</label>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {previewUrl && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Preview</label>
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border border-slate-200"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Brand Selection */}
                <div className="card hover-lift p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Select Brand</h2>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {brands.map((brand) => (
                      <label key={brand.id} className="flex items-center p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                        <input
                          type="radio"
                          name="brand"
                          value={brand.id}
                          checked={selectedBrand === brand.id}
                          onChange={(e) => setSelectedBrand(e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{brand.logo}</span>
                            <span className="font-medium text-slate-900">{brand.name}</span>
                          </div>
                          <div className="text-sm text-slate-600">{brand.industry}</div>
                          <div className="text-sm text-slate-500 italic">{brand.tone}</div>
                        </div>
                      </label>
                    ))}

                    {brands.length === 0 && (
                      <div className="text-center py-8 text-slate-500">
                        No brands available. <Link href="/admin/brands" className="text-blue-600">Create some first</Link>.
                      </div>
                    )}
                  </div>
                </div>

                {/* Demographics Selection */}
                <div className="card hover-lift p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Target Demographics</h2>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">Select demographics to analyze for</p>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {demographics.map((demographic) => (
                      <label key={demographic.id} className="flex items-start p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedDemographics.includes(demographic.id)}
                          onChange={() => toggleDemographic(demographic.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded mt-1"
                        />
                        <div className="ml-3 flex-1">
                          <div className="font-medium text-slate-900">{demographic.name}</div>
                          <div className="text-sm text-slate-600">{demographic.age_range}</div>
                          <div className="text-sm text-slate-500">{demographic.description}</div>
                        </div>
                      </label>
                    ))}

                    {demographics.length === 0 && (
                      <div className="text-center py-8 text-slate-500">
                        No demographics available. <Link href="/admin/demographics" className="text-blue-600">Create some first</Link>.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-center pt-12">
                <button
                  onClick={analyzeAd}
                  disabled={isAnalyzing || !selectedBrand || selectedDemographics.length === 0 || (!imageUrl && !imageFile)}
                  className="btn btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing Advertisement...
                    </div>
                  ) : (
                    'Analyze Advertisement →'
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Analysis Results */
            <div className="max-w-6xl mx-auto space-y-12">
              {/* Success Header */}
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Analysis Complete
                </div>
                <h2 className="text-4xl font-bold text-slate-900 mb-4">Your Ad Analysis</h2>
                <p className="text-xl text-slate-600">AI-powered insights and recommendations for your advertisement</p>
              </div>

              {/* Results Content */}
              <div className="space-y-12">
                {/* Image and Overview */}
                <div className="card hover-lift p-8">
                  <div className="flex flex-col lg:flex-row items-start gap-8">
                    <img
                      src={previewUrl}
                      alt="Analyzed Advertisement"
                      className="w-full lg:w-80 h-64 object-cover rounded-2xl shadow-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-4xl">{analysisResult.brand.logo}</span>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">{analysisResult.brand.name}</h3>
                          <p className="text-slate-600">{analysisResult.brand.industry}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {analysisResult.demographics.map((demo) => (
                          <span key={demo.id} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            {demo.name}
                          </span>
                        ))}
                      </div>

                      <div className={`inline-flex items-center px-6 py-3 rounded-2xl font-bold text-2xl ${getScoreBackground(analysisResult.overall_score)} ${getScoreColor(analysisResult.overall_score)}`}>
                        Overall Score: {analysisResult.overall_score}/10
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Scores */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="card hover-lift p-6 text-center group">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className={`text-4xl font-bold mb-2 ${getScoreColor(analysisResult.brand_alignment)}`}>
                      {analysisResult.brand_alignment}/10
                    </div>
                    <div className="text-slate-600 font-medium">Brand Alignment</div>
                  </div>

                  <div className="card hover-lift p-6 text-center group">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div className={`text-4xl font-bold mb-2 ${getScoreColor(analysisResult.emotional_impact)}`}>
                      {analysisResult.emotional_impact}/10
                    </div>
                    <div className="text-slate-600 font-medium">Emotional Impact</div>
                  </div>

                  <div className="card hover-lift p-6 text-center group">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <div className={`text-4xl font-bold mb-2 ${getScoreColor(analysisResult.clarity)}`}>
                      {analysisResult.clarity}/10
                    </div>
                    <div className="text-slate-600 font-medium">Message Clarity</div>
                  </div>

                  <div className="card hover-lift p-6 text-center group">
                    <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v22a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3z" />
                      </svg>
                    </div>
                    <div className={`text-4xl font-bold mb-2 ${getScoreColor(analysisResult.visual_appeal)}`}>
                      {analysisResult.visual_appeal}/10
                    </div>
                    <div className="text-slate-600 font-medium">Visual Appeal</div>
                  </div>
                </div>

                {/* Feedback Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="card hover-lift p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-green-700">Strengths</h3>
                    </div>
                    <ul className="space-y-4">
                      {analysisResult.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                          <span className="text-slate-700 leading-relaxed">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="card hover-lift p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-red-700">Areas for Improvement</h3>
                    </div>
                    <ul className="space-y-4">
                      {analysisResult.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                          <span className="text-slate-700 leading-relaxed">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="card hover-lift p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-blue-700">Suggestions</h3>
                    </div>
                    <ul className="space-y-4">
                      {analysisResult.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                          <span className="text-slate-700 leading-relaxed">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Button for New Analysis */}
                <div className="flex justify-center pt-8">
                  <button
                    onClick={resetAnalysis}
                    className="btn btn-primary text-lg px-8 py-4"
                  >
                    Analyze Another Ad →
                  </button>
                </div>
              </div>
            </div>
          )}

        {error && (
          <div className="card mt-8 p-6 border-l-4 border-red-500 bg-red-50">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              <div className="text-red-800 font-medium">{error}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}