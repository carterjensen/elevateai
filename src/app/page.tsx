'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import Header from '../components/Header';

export default function Home() {
  useEffect(() => {
    // Add intersection observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all elements with data-animate
    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Use shared header component */}
      <Header />

      {/* Main Content */}
      <main className="relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-64 -right-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          {/* Hero Section */}
          <div className="text-center mb-24" data-animate>
            <div className="inline-flex items-center px-4 py-2 bg-blue-100/80 backdrop-blur-xl text-blue-700 rounded-full text-sm font-medium mb-8 border border-blue-200/50">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              AI-Powered Marketing Intelligence
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="gradient-text">Elevate</span>
              <br />
              <span className="text-gray-900">Your Marketing</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-4xl mx-auto">
              Transform your advertising strategy with AI-powered insights. Get demographic-specific analysis, 
              brand alignment scores, and data-driven recommendations that drive results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link 
                href="/ad-critic"
                className="btn-primary text-white px-10 py-4 rounded-2xl font-semibold text-lg shadow-xl group"
              >
                <span className="flex items-center gap-2">
                  Start Analyzing Ads
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              <Link 
                href="/admin"
                className="btn-secondary bg-white text-gray-700 px-10 py-4 rounded-2xl font-semibold text-lg border border-gray-200 shadow-lg group"
              >
                <span className="flex items-center gap-2">
                  Explore Admin Panel
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center" data-animate>
                <div className="text-4xl font-bold text-gray-900 mb-2">70%</div>
                <div className="text-gray-600">Faster Campaign Optimization</div>
              </div>
              <div className="text-center" data-animate>
                <div className="text-4xl font-bold text-gray-900 mb-2">10x</div>
                <div className="text-gray-600">Better Audience Targeting</div>
              </div>
              <div className="text-center" data-animate>
                <div className="text-4xl font-bold text-gray-900 mb-2">95%</div>
                <div className="text-gray-600">Client Satisfaction Rate</div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-20">
            <div className="text-center mb-16" data-animate>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Powerful AI Tools for
                <span className="gradient-text"> Every Campaign</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From ad critique to brand voice analysis, our suite of AI tools covers every 
                aspect of your marketing workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* AdCritic Card */}
              <div className="group bg-white/60 backdrop-blur-xl p-8 rounded-2xl border border-gray-200/50 hover:bg-white/80 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2" data-animate>
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600">Live & Active</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">AdCritic</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Get instant, demographic-tailored critiques on your ads. Upload images and get AI-powered analysis with demographic insights, brand alignment scores, and actionable recommendations.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    AI-powered image analysis
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Demographic scoring & insights
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Brand alignment & recommendations
                  </div>
                </div>

                <Link
                  href="/ad-critic"
                  className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all group-hover:-translate-y-1 transform"
                >
                  <span className="flex items-center justify-center gap-2">
                    Launch AdCritic
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
              </div>

              {/* BrandChat Card */}
              <div className="group bg-white/60 backdrop-blur-xl p-8 rounded-2xl border border-gray-200/50 hover:bg-white/80 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2" data-animate>
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600">Live & Active</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">BrandChat</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Simulate real conversations with your target audience personas, infused with your brand&apos;s voice. Test messaging in minutes and ensure personalized content resonates perfectly.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Persona simulation & chat
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Brand voice consistency
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Message resonance testing
                  </div>
                </div>

                <Link
                  href="/brandchat"
                  className="block w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all group-hover:-translate-y-1 transform"
                >
                  <span className="flex items-center justify-center gap-2">
                    Launch BrandChat
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
              </div>

              {/* LegalLens Card */}
              <div className="group bg-white/60 backdrop-blur-xl p-8 rounded-2xl border border-gray-200/50 hover:bg-white/80 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2" data-animate>
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600">Live & Active</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">LegalLens</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Pre-scan ads against client-specific legal requirements to avoid costly revisions and delays. Score compliance in seconds with AI-powered analysis and get actionable recommendations.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Text, image & video analysis
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    0-100 compliance scoring
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Actionable recommendations
                  </div>
                </div>

                <Link
                  href="/legallens"
                  className="block w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white text-center py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all group-hover:-translate-y-1 transform"
                >
                  <span className="flex items-center justify-center gap-2">
                    Launch LegalLens
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t mt-24">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 ElevateAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}