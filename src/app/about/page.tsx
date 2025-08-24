'use client';

import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">ElevateAI</h1>
              </Link>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors">
                Admin
              </Link>
              <Link href="/superadmin" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold">
                Super Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            About ElevateAI
          </h1>
          <p className="text-xl text-gray-600">
            Understanding our methodology and tracking platform development
          </p>
        </div>

        {/* Methodology Section */}
        <div className="space-y-12">
          {/* BrandChat Methodology */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">BrandChat</h2>
                <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
                  ✅ Active
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Core Methodology</h3>
                <p className="text-gray-600 leading-relaxed">
                  BrandChat uses a sophisticated layered prompt system powered by Grok AI (grok-2-1212) to simulate authentic conversations between consumer personas and brands. The system combines three prompt layers:
                </p>
                <ul className="mt-3 space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <span><strong>System Layer:</strong> Core behavioral instructions and conversation guidelines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <span><strong>Persona Layer:</strong> Demographic-specific characteristics, values, and communication styles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <span><strong>Brand Layer:</strong> Brand voice, tone, and positioning guidelines</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Personas</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { emoji: '🎮', name: 'Gen Z Consumer', desc: '18-26, digital native' },
                    { emoji: '💼', name: 'Millennial Professional', desc: '27-42, career-focused' },
                    { emoji: '👨‍👩‍👧‍👦', name: 'Gen X Parent', desc: '43-58, family-oriented' },
                    { emoji: '👴', name: 'Baby Boomer', desc: '59+, traditional values' },
                    { emoji: '🌱', name: 'Eco-Warrior', desc: 'Sustainability-focused' },
                    { emoji: '🚀', name: 'Tech Enthusiast', desc: 'Early adopter, influencer' }
                  ].map((persona, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="text-lg mb-1">{persona.emoji}</div>
                      <div className="text-sm font-semibold text-gray-900">{persona.name}</div>
                      <div className="text-xs text-gray-600">{persona.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Supported Brands</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { logo: '🍎', name: 'Apple', tone: 'Sleek, innovative' },
                    { logo: '👟', name: 'Nike', tone: 'Motivational, bold' },
                    { logo: '⚡', name: 'Tesla', tone: 'Futuristic, disruptive' },
                    { logo: '☕', name: 'Starbucks', tone: 'Warm, inclusive' },
                    { logo: '🏔️', name: 'Patagonia', tone: 'Authentic, eco-conscious' },
                    { logo: '🎬', name: 'Netflix', tone: 'Casual, entertaining' }
                  ].map((brand, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="text-lg mb-1">{brand.logo}</div>
                      <div className="text-sm font-semibold text-gray-900">{brand.name}</div>
                      <div className="text-xs text-gray-600">{brand.tone}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Implementation</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Dynamic prompt generation with variable substitution</li>
                    <li>• Real-time AI connection status monitoring</li>
                    <li>• Conversation history management and context preservation</li>
                    <li>• Supabase backend for prompt storage and management</li>
                    <li>• Super Admin dashboard for system-level prompt engineering</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* AdCritic Methodology */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">AdCritic</h2>
                <div className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-4">
                  🚧 Early Beta
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Core Methodology</h3>
                <p className="text-gray-600 leading-relaxed">
                  AdCritic provides demographic-tailored advertisement critiques to optimize campaign performance before launch. The system analyzes creative content against demographic preferences and provides actionable feedback.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Status</h3>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-orange-800">
                    <strong>In Development:</strong> AdCritic is currently in early beta phase. The methodology and implementation details will be updated as the module development progresses.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* LegalLens Methodology */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <div className="w-6 h-6 bg-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">LegalLens</h2>
                <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
                  ✅ Active
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Core Methodology</h3>
                <p className="text-gray-600 leading-relaxed">
                  LegalLens provides comprehensive legal compliance analysis for advertising content across multiple media types. The system uses AI-powered analysis to evaluate content against a database of legal compliance rules and regulations.
                </p>
                <ul className="mt-3 space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <span><strong>Multi-Modal Analysis:</strong> Text analysis via GPT-4, image analysis via GPT-4 Vision, video analysis via Gemini AI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <span><strong>Scoring System:</strong> 0-100 compliance score with detailed violation and warning breakdowns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <span><strong>Rule-Based Engine:</strong> Configurable legal compliance rules across multiple categories and severity levels</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal Compliance Categories</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { name: 'FDA Health Claims', severity: 'critical', category: 'Health & Medical' },
                    { name: 'FTC Truth in Advertising', severity: 'high', category: 'General Compliance' },
                    { name: 'Financial Services', severity: 'critical', category: 'Financial' },
                    { name: 'COPPA (Children)', severity: 'high', category: 'Children\'s Advertising' },
                    { name: 'Alcohol & Tobacco', severity: 'critical', category: 'Restricted Products' },
                    { name: 'Privacy & Data Protection', severity: 'high', category: 'Privacy' }
                  ].map((rule, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm font-semibold text-gray-900 mb-1">{rule.name}</div>
                      <div className="text-xs text-gray-600 mb-1">{rule.category}</div>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        rule.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        rule.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {rule.severity.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Analysis Workflow</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ol className="space-y-2 text-sm text-gray-700">
                    <li><strong>1. Content Ingestion:</strong> Accept text, images (JPG/PNG), or video files for analysis</li>
                    <li><strong>2. Rule Retrieval:</strong> Fetch active legal compliance rules from database</li>
                    <li><strong>3. AI Analysis:</strong> Process content against rules using appropriate AI model (GPT-4/Gemini)</li>
                    <li><strong>4. Scoring & Classification:</strong> Generate 0-100 score with violations and warnings</li>
                    <li><strong>5. Report Generation:</strong> Provide actionable recommendations and specific issue identification</li>
                    <li><strong>6. Result Caching:</strong> Store analysis for future reference and performance optimization</li>
                  </ol>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Implementation</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Administrative interface for managing custom legal compliance rules</li>
                    <li>• Multi-AI integration: OpenAI GPT-4 (text/image) + Google Gemini (video)</li>
                    <li>• Supabase backend for rule storage and analysis history</li>
                    <li>• Real-time compliance scoring with detailed violation breakdowns</li>
                    <li>• Content hash-based caching for performance optimization</li>
                    <li>• Severity-based rule categorization (low, medium, high, critical)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deployment Log Section */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1zm8-8a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Deployment Log</h2>
                <p className="text-gray-600">Track platform updates and feature releases</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Deployment Entries */}
              <div className="border-l-4 border-green-500 pl-6 pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full -ml-8"></div>
                  <span className="text-sm font-semibold text-green-700">v1.3.0 - August 23, 2025</span>
                  <span className="text-xs text-gray-500">Latest</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Navigation & Documentation Update</h3>
                <p className="text-gray-600 mb-3">
                  Added navigation header with Admin/Super Admin access and comprehensive About page with methodology documentation and deployment tracking.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Navigation Enhancement</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Documentation</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">User Experience</span>
                </div>
              </div>

              <div className="border-l-4 border-blue-500 pl-6 pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full -ml-8"></div>
                  <span className="text-sm font-semibold text-blue-700">v1.2.1 - August 23, 2025</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">ESLint & Deployment Fixes</h3>
                <p className="text-gray-600 mb-3">
                  Resolved all TypeScript and ESLint errors preventing Vercel deployment. Fixed &apos;any&apos; type errors, removed unused variables, and escaped React entities.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Bug Fix</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Deployment</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Code Quality</span>
                </div>
              </div>

              <div className="border-l-4 border-purple-500 pl-6 pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full -ml-8"></div>
                  <span className="text-sm font-semibold text-purple-700">v1.2.0 - August 23, 2025</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Super Admin Dashboard Launch</h3>
                <p className="text-gray-600 mb-3">
                  Released comprehensive Super Admin Dashboard with system-level prompt management, live testing, and real-time preview of exact API requests sent to Grok AI.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">Major Feature</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">Admin Tools</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">Prompt Engineering</span>
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-6 pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full -ml-8"></div>
                  <span className="text-sm font-semibold text-green-700">v1.1.0 - August 22, 2025</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">BrandChat Module Launch</h3>
                <p className="text-gray-600 mb-3">
                  Launched BrandChat with 6 consumer personas and 6 major brands, powered by Grok AI with layered prompt system and real-time connection monitoring.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Major Feature</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">AI Integration</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Persona Simulation</span>
                </div>
              </div>

              <div className="border-l-4 border-gray-500 pl-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full -ml-8"></div>
                  <span className="text-sm font-semibold text-gray-700">v1.0.0 - August 21, 2025</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Initial Platform Launch</h3>
                <p className="text-gray-600 mb-3">
                  Initial ElevateAI platform deployment with three-module architecture: BrandChat, AdCritic, and LegalLens. Established Supabase backend and Vercel hosting.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Initial Release</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Platform Foundation</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Infrastructure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}