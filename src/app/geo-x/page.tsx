'use client';

import Header from '../../components/Header';
import { useState } from 'react';
import GeoXScoreDashboard from '../../components/GeoXScoreDashboard';

const stats = [
  "E-commerce sites have seen a 22% drop in search traffic due to AI-generated shopping suggestions, as users increasingly rely on direct AI recommendations over traditional clicks.",
  "By 2026, 55% of all searches will involve AI-generated responses rather than traditional web results, signaling a massive pivot away from link-based search engines like Google.",
  "Traditional search volume is predicted to drop 25% by 2026, with organic traffic potentially decreasing by over 50% as AI-powered search takes over, forcing brands to adapt or lose visibility.",
  "Backlinks contribute 30% less to rankings in AI-generated responses compared to traditional SEO, emphasizing GEO's focus on content structure and context over link-building.",
  "60% of searches now end without a click (zero-click searches), amplified by AI summaries, which are trusted by 70% of users and used for research or recommendations 80% of the time."
];

const testimonials = [
  {
    quote: "Generative Engine Optimization (GEO) is rewriting the rules of search — unlocking an $80B+ opportunity",
    author: "Zach Cohen",
    title: "Investor at a16z",
    avatar: "https://pbs.twimg.com/profile_images/1234567890/example.jpg",
    tweetImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23000'/%3E%3Ctext x='20' y='30' fill='white' font-size='14'%3EZach Cohen @zachcohen%3C/text%3E%3Ctext x='20' y='60' fill='white' font-size='12'%3EGenerative Engine Optimization (GEO) is rewriting%3C/text%3E%3Ctext x='20' y='80' fill='white' font-size='12'%3Ethe rules of search — unlocking an $80B+ opportunity%3C/text%3E%3C/svg%3E"
  },
  {
    quote: "SEO is slowly losing its dominance. Welcome to GEO. ... Generative Engine Optimization is positioned to become the new playbook for brand visibility.",
    author: "a16z",
    title: "Andreessen Horowitz",
    avatar: "https://pbs.twimg.com/profile_images/a16z/example.jpg",
    tweetImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23000'/%3E%3Ctext x='20' y='30' fill='white' font-size='14'%3Ea16z @a16z%3C/text%3E%3Ctext x='20' y='60' fill='white' font-size='12'%3ESEO is slowly losing its dominance. Welcome to GEO.%3C/text%3E%3Ctext x='20' y='80' fill='white' font-size='12'%3EGenerative Engine Optimization is positioned to become%3C/text%3E%3Ctext x='20' y='100' fill='white' font-size='12'%3Ethe new playbook for brand visibility.%3C/text%3E%3C/svg%3E"
  },
  {
    quote: "GEO (generative engine optimization) is gonna shake up the SEO industry...",
    author: "EP",
    title: "Founder of AI Frontrunners",
    avatar: "https://pbs.twimg.com/profile_images/ep/example.jpg",
    tweetImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23000'/%3E%3Ctext x='20' y='30' fill='white' font-size='14'%3EEP @aifrontrunners%3C/text%3E%3Ctext x='20' y='60' fill='white' font-size='12'%3EGEO (generative engine optimization) is gonna%3C/text%3E%3Ctext x='20' y='80' fill='white' font-size='12'%3Eshake up the SEO industry...%3C/text%3E%3C/svg%3E"
  },
  {
    quote: "SEO gets you visibility on Google GEO (Generative Engine Optimization) earns you a spot in AI-driven answers",
    author: "Bernie Fussenegger",
    title: "Marketing Strategist",
    avatar: "https://pbs.twimg.com/profile_images/bernie/example.jpg",
    tweetImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23000'/%3E%3Ctext x='20' y='30' fill='white' font-size='14'%3EBernie Fussenegger @bernie%3C/text%3E%3Ctext x='20' y='60' fill='white' font-size='12'%3ESEO gets you visibility on Google%3C/text%3E%3Ctext x='20' y='80' fill='white' font-size='12'%3EGEO earns you a spot in AI-driven answers%3C/text%3E%3C/svg%3E"
  },
  {
    quote: "Generative Engine Optimization (GEO) is the NEW frontier. 🚀 Unlike Google SEO → Generative search answers FIRST.",
    author: "AI SEO Agency",
    title: "Digital Marketing Experts",
    avatar: "https://pbs.twimg.com/profile_images/aiseo/example.jpg",
    tweetImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23000'/%3E%3Ctext x='20' y='30' fill='white' font-size='14'%3EAI SEO Agency @aiseoagency%3C/text%3E%3Ctext x='20' y='60' fill='white' font-size='12'%3EGenerative Engine Optimization (GEO) is the%3C/text%3E%3Ctext x='20' y='80' fill='white' font-size='12'%3ENEW frontier. 🚀 Unlike Google SEO →%3C/text%3E%3Ctext x='20' y='100' fill='white' font-size='12'%3EGenerative search answers FIRST.%3C/text%3E%3C/svg%3E"
  }
];

export default function GeoXPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [promptResults, setPromptResults] = useState<Array<{ query: string; intent: string; score: number }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [productCategory, setProductCategory] = useState('');

  const generatePrompts = async () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      const samplePrompts = [
        { query: "What are the best wireless earbuds for 2024?", intent: "research", score: 95 },
        { query: "Compare AirPods vs Sony WF-1000XM5", intent: "comparison", score: 92 },
        { query: "Best deals on premium headphones", intent: "purchase", score: 89 },
        { query: "Noise cancelling headphones for work", intent: "research", score: 87 },
        { query: "Are Bose headphones worth the money?", intent: "comparison", score: 85 }
      ];
      setPromptResults(samplePrompts);
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-blue-800/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-full p-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">GX</span>
                </div>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              GEO-X
            </h1>
            <p className="text-2xl md:text-3xl text-purple-200 mb-8 font-light">
              Generative Engine Optimization
            </p>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              The future of search is here. Optimize your content for AI-powered search engines and capture the $80B+ opportunity that&apos;s reshaping digital marketing forever.
            </p>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12">
              <a 
                href="/geo-x/prompt-discovery"
                className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-purple-500/20 transform hover:scale-105 block"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Prompt Discovery</h3>
                  <p className="text-gray-300">Generate the top 50 AI prompts for your product category</p>
                </div>
              </a>
              
              <div 
                onClick={() => setActiveModal('geo-score')}
                className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-blue-500/20 transform hover:scale-105"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Your GEO-X Score</h3>
                  <p className="text-gray-300">Analyze your content&apos;s AI optimization potential</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-black/30 backdrop-blur-sm py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              The Numbers Don&apos;t Lie
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Five eye-opening statistics that prove GEO is reshaping the search landscape
            </p>
          </div>
          
          <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{index + 1}</span>
                  </div>
                  <p className="text-gray-200 text-lg leading-relaxed">{stat}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Industry Leaders Speak
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              What top investors and marketing strategists are saying about GEO
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 transform hover:scale-105">
                <div className="mb-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={testimonial.tweetImage} 
                    alt={`Tweet by ${testimonial.author}`} 
                    className="w-full rounded-lg border border-gray-600"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">{testimonial.author.slice(0,2).toUpperCase()}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.author}</h4>
                    <p className="text-purple-300 text-sm">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Footer */}
      <div className="border-t border-purple-500/20 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 ElevateAI - GEO-X. The future of search optimization.
          </p>
        </div>
      </div>

      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto border border-purple-500/30">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">
                  {activeModal === 'prompt-discovery' ? 'Prompt Discovery Engine' : 'Your GEO-X Score'}
                </h2>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>
              
              {activeModal === 'prompt-discovery' && (
                <div>
                  <div className="mb-8">
                    <label className="block text-white text-sm font-medium mb-2">Product Category</label>
                    <input 
                      type="text" 
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                      placeholder="e.g., wireless earbuds, premium audio, fitness trackers"
                      className="w-full p-3 rounded-lg bg-black/30 border border-purple-400/30 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                  
                  <button 
                    onClick={generatePrompts}
                    disabled={!productCategory || isGenerating}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 mb-8"
                  >
                    {isGenerating ? 'Generating Prompts...' : 'Generate Top 50 Prompts'}
                  </button>
                  
                  {isGenerating && (
                    <div className="flex items-center gap-3 mb-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
                      <span className="text-gray-300">Analyzing AI search patterns...</span>
                    </div>
                  )}
                  
                  {promptResults.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Top Discovered Prompts</h3>
                      <div className="space-y-4">
                        {promptResults.map((prompt, idx) => (
                          <div key={idx} className="bg-black/20 rounded-lg p-4 border border-purple-400/20">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-white font-medium">{prompt.query}</span>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  prompt.intent === 'research' ? 'bg-blue-600/20 text-blue-300' :
                                  prompt.intent === 'comparison' ? 'bg-yellow-600/20 text-yellow-300' :
                                  'bg-green-600/20 text-green-300'
                                }`}>
                                  {prompt.intent}
                                </span>
                                <span className="text-purple-300 font-bold">{prompt.score}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {activeModal === 'geo-score' && (
                <GeoXScoreDashboard onClose={() => setActiveModal(null)} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}