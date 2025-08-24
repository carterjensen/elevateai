'use client';

import { useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MouseCursor from '@/components/MouseCursor';

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add custom cursor to body
    document.body.style.cursor = 'none';
    
    // Intersection Observer for animations
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

    // Observe all animatable elements
    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <MouseCursor />
      <Header />
      
      {/* Hero Section */}
      <main className="pt-24">
        {/* Hero */}
        <section ref={heroRef} className="relative px-6 py-24 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto text-center relative z-10">
            <div className="max-w-4xl mx-auto animate-stagger">
              {/* Badge */}
              <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-xl border border-blue-200/50 rounded-full text-blue-700 font-medium mb-8 shadow-lg hover:shadow-xl transition-all cursor-interactive">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></span>
                ⚡ AI-Powered Brand & Marketing Solutions
              </div>

              {/* Main Heading */}
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                <span className="text-gradient">Elevate</span>
                <br />
                <span className="text-slate-900">Your Brand</span>
              </h1>

              {/* Subheading */}
              <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed max-w-3xl mx-auto">
                Revolutionize your marketing workflow with our comprehensive suite of AI-powered tools designed to enhance creativity, streamline processes, and deliver exceptional results.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <a
                  href="/ad-critic"
                  className="bg-gradient-primary text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:-translate-y-1 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-interactive"
                >
                  Start with Ad Critic →
                </a>
                <a
                  href="/brandchat"
                  className="bg-white/80 backdrop-blur-xl text-slate-800 px-8 py-4 rounded-2xl font-semibold text-lg border border-slate-200 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl cursor-interactive"
                >
                  Try BrandChat
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center" data-animate>
                  <div className="text-3xl font-bold text-slate-900 mb-2">70%</div>
                  <div className="text-slate-600">Faster Revisions</div>
                </div>
                <div className="text-center" data-animate>
                  <div className="text-3xl font-bold text-slate-900 mb-2">10x</div>
                  <div className="text-slate-600">Better Performance</div>
                </div>
                <div className="text-center" data-animate>
                  <div className="text-3xl font-bold text-slate-900 mb-2">95%</div>
                  <div className="text-slate-600">Client Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="px-6 py-24 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6" data-animate>
                Powerful AI Tools for
                <span className="text-gradient"> Every Campaign</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto" data-animate>
                From ad critique to brand voice simulation, our suite of AI tools covers every aspect of your marketing workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* AdCritic */}
              <div className="card hover-lift p-8 group cursor-interactive" data-animate>
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600">Live & Active</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4">AdCritic</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Get instant, demographic-tailored critiques on your ads. Cut revision cycles by 70%, boost campaign performance, and wow clients with data-backed creatives that convert.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Demographic-specific analysis
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Real-time performance scoring
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Actionable improvement suggestions
                  </div>
                </div>

                <a
                  href="/ad-critic"
                  className="block w-full bg-gradient-primary text-white text-center py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all cursor-interactive"
                >
                  Launch AdCritic →
                </a>
              </div>

              {/* BrandChat */}
              <div className="card hover-lift p-8 group cursor-interactive" data-animate>
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600">Live & Active</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4">BrandChat</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Simulate real conversations with your target audience personas, infused with your brand&apos;s voice. Test messaging in minutes and ensure personalized content resonates.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Persona simulation
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Brand voice consistency
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Message resonance testing
                  </div>
                </div>

                <a
                  href="/brandchat"
                  className="block w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all cursor-interactive"
                >
                  Launch BrandChat →
                </a>
              </div>

              {/* LegalLens */}
              <div className="card hover-lift p-8 group cursor-interactive" data-animate>
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-yellow-600">Coming Soon</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4">LegalLens</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Pre-scan ads against client-specific legal requirements to avoid costly revisions and delays. Score compliance in seconds and streamline approvals.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Compliance scoring
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Risk prevention
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Legal protection
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white py-3 px-6 rounded-xl font-semibold opacity-60 cursor-not-allowed">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="container mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6" data-animate>
                Built for Modern Marketing Teams
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto" data-animate>
                Our AI tools integrate seamlessly into your existing workflow, providing instant insights and actionable recommendations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center p-6" data-animate>
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-slate-400">Get results in seconds, not hours. Our AI processes and analyzes at unprecedented speed.</p>
              </div>

              <div className="text-center p-6" data-animate>
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Data-Driven</h3>
                <p className="text-slate-400">Every recommendation is backed by comprehensive analysis and proven performance data.</p>
              </div>

              <div className="text-center p-6" data-animate>
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Fully Customizable</h3>
                <p className="text-slate-400">Tailor every tool to your brand&apos;s unique voice, audience, and requirements.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" data-animate>
              Ready to Elevate Your Marketing?
            </h2>
            <p className="text-xl mb-12 max-w-2xl mx-auto opacity-90" data-animate>
              Join thousands of marketing professionals who are already using ElevateAI to create better campaigns faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center" data-animate>
              <a
                href="/ad-critic"
                className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:-translate-y-1 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-interactive"
              >
                Get Started Free
              </a>
              <a
                href="/admin"
                className="bg-white/20 backdrop-blur-xl text-white px-8 py-4 rounded-2xl font-semibold text-lg border border-white/30 hover:-translate-y-1 transition-all duration-300 cursor-interactive"
              >
                View Admin Panel
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
