'use client';

import { useState, useEffect, useRef } from 'react';

interface MetricScore {
  score: number;
  reasoning: string;
  examples: string[];
}

interface KeyQuote {
  quote: string;
  context: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  topic: string;
  source_query: string;
}

interface QualitativeInsights {
  keyQuotes: KeyQuote[];
  themes: Array<{
    theme: string;
    mentions: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    examples: string[];
  }>;
  strengthsWeaknesses: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
  };
}

interface PlatformAnalysis {
  platform: 'openai' | 'grok';
  responses: Array<{
    query: string;
    response: string;
    sources?: Array<{
      type: string;
      title: string;
      url: string;
      snippet: string;
      author?: string;
      date?: string;
    }>;
    processingTime: number;
  }>;
  metrics: {
    quality: MetricScore;
    value: MetricScore;
    trust: MetricScore;
    customerExperience: MetricScore;
    brandReputation: MetricScore;
    innovation: MetricScore;
    sustainability: MetricScore;
    emotionalConnection: MetricScore;
  };
  overallSentiment: {
    score: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    confidence: number;
  };
  qualitativeInsights: QualitativeInsights;
}

interface SentimentAnalysisResponse {
  brandName: string;
  platforms: PlatformAnalysis[];
  comparison: {
    averageScores: {
      openai?: { [key: string]: number };
      grok?: { [key: string]: number };
    };
    strongestMetrics: string[];
    weakestMetrics: string[];
    recommendations: string[];
  };
}

interface GeoXScoreDashboardProps {
  onClose: () => void;
}

const MetricCard = ({ 
  name, 
  score, 
  reasoning, 
  examples, 
  icon, 
  color 
}: { 
  name: string; 
  score: number; 
  reasoning: string; 
  examples: string[]; 
  icon: string; 
  color: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`bg-gradient-to-br ${color} backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <h4 className="text-white font-semibold text-sm">{name}</h4>
        </div>
        <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
          {score.toFixed(1)}
        </div>
      </div>
      
      <div className="w-full bg-black/30 rounded-full h-2 mb-3">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${
            score >= 8 ? 'bg-green-400' : score >= 6 ? 'bg-yellow-400' : 'bg-red-400'
          }`} 
          style={{ width: `${Math.min(score * 10, 100)}%` }}
        />
      </div>
      
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-purple-300 hover:text-white text-xs transition-colors duration-200"
      >
        {isExpanded ? 'Hide Details' : 'Show Details'}
      </button>
      
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-gray-300 text-xs mb-2">{reasoning}</p>
          {examples.length > 0 && (
            <div>
              <p className="text-purple-300 text-xs font-medium mb-1">Key Examples:</p>
              <ul className="text-gray-400 text-xs space-y-1">
                {examples.map((example, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-purple-400 mt-0.5">•</span>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const PlatformComparison = ({ platforms }: { platforms: PlatformAnalysis[] }) => {
  const openai = platforms.find(p => p.platform === 'openai');
  const grok = platforms.find(p => p.platform === 'grok');
  
  const metricNames = [
    { key: 'quality', label: 'Quality', icon: '⭐' },
    { key: 'value', label: 'Value', icon: '💰' },
    { key: 'trust', label: 'Trust', icon: '🛡️' },
    { key: 'customerExperience', label: 'Customer Experience', icon: '😊' },
    { key: 'brandReputation', label: 'Brand Reputation', icon: '🏆' },
    { key: 'innovation', label: 'Innovation', icon: '🚀' },
    { key: 'sustainability', label: 'Sustainability', icon: '🌱' },
    { key: 'emotionalConnection', label: 'Emotional Connection', icon: '❤️' }
  ];

  return (
    <div className="bg-black/20 rounded-xl p-6 border border-purple-500/20">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span>⚖️</span>
        Platform Comparison
      </h3>
      
      <div className="space-y-4">
        {metricNames.map(({ key, label, icon }) => (
          <div key={key} className="flex items-center gap-4">
            <div className="flex items-center gap-2 min-w-[200px]">
              <span>{icon}</span>
              <span className="text-white text-sm">{label}</span>
            </div>
            
            <div className="flex-1 flex items-center gap-4">
              {openai && (
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-blue-400 text-xs font-medium min-w-[60px]">OpenAI</span>
                  <div className="flex-1 bg-black/30 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-blue-400 transition-all duration-500"
                      style={{ width: `${Math.min(openai.metrics[key as keyof typeof openai.metrics].score * 10, 100)}%` }}
                    />
                  </div>
                  <span className="text-blue-400 text-sm font-bold min-w-[30px]">
                    {openai.metrics[key as keyof typeof openai.metrics].score.toFixed(1)}
                  </span>
                </div>
              )}
              
              {grok && (
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-purple-400 text-xs font-medium min-w-[60px]">Grok</span>
                  <div className="flex-1 bg-black/30 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-purple-400 transition-all duration-500"
                      style={{ width: `${Math.min(grok.metrics[key as keyof typeof grok.metrics].score * 10, 100)}%` }}
                    />
                  </div>
                  <span className="text-purple-400 text-sm font-bold min-w-[30px]">
                    {grok.metrics[key as keyof typeof grok.metrics].score.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const QualitativeInsightsView = ({ platforms }: { platforms: PlatformAnalysis[] }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<number>(0);
  const [selectedQuote, setSelectedQuote] = useState<number | null>(null);

  const currentPlatform = platforms[selectedPlatform];
  const insights = currentPlatform?.qualitativeInsights;

  if (!insights) {
    return (
      <div className="bg-black/20 rounded-xl p-6 border border-white/10">
        <div className="text-center py-8">
          <div className="text-gray-400">No qualitative insights available</div>
        </div>
      </div>
    );
  }

  const getSentimentColor = (sentiment: 'positive' | 'neutral' | 'negative') => {
    switch (sentiment) {
      case 'positive': return 'text-green-400 border-green-400/20 bg-green-400/10';
      case 'negative': return 'text-red-400 border-red-400/20 bg-red-400/10';
      default: return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Platform Selector */}
      {platforms.length > 1 && (
        <div className="flex gap-2">
          {platforms.map((platform, idx) => (
            <button
              key={platform.platform}
              onClick={() => setSelectedPlatform(idx)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedPlatform === idx
                  ? platform.platform === 'openai'
                    ? 'bg-blue-600 text-white'
                    : 'bg-purple-600 text-white'
                  : 'bg-black/20 text-gray-300 hover:text-white'
              }`}
            >
              {platform.platform === 'openai' ? '🤖 OpenAI' : '🐺 Grok'} Insights
            </button>
          ))}
        </div>
      )}

      {/* Key Quotes */}
      <div className="bg-black/20 rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>💬</span>
          Key Quotes from AI Analysis
        </h3>
        
        <div className="grid gap-4">
          {insights.keyQuotes.map((quote, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                selectedQuote === idx ? 'ring-2 ring-purple-400' : ''
              } ${getSentimentColor(quote.sentiment)}`}
              onClick={() => setSelectedQuote(selectedQuote === idx ? null : idx)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <blockquote className="text-white font-medium italic text-lg leading-relaxed">
                    &ldquo;{quote.quote}&rdquo;
                  </blockquote>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    quote.sentiment === 'positive' ? 'bg-green-600/20 text-green-300' :
                    quote.sentiment === 'negative' ? 'bg-red-600/20 text-red-300' :
                    'bg-yellow-600/20 text-yellow-300'
                  }`}>
                    {quote.sentiment}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {selectedQuote === idx ? '▼' : '▶'}
                  </span>
                </div>
              </div>
              
              {selectedQuote === idx && (
                <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-purple-300 font-medium">Context:</span>
                    <span className="text-gray-300">{quote.context}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-purple-300 font-medium">Topic:</span>
                    <span className="text-gray-300 capitalize">{quote.topic}</span>
                  </div>
                  <div className="flex items-start gap-4 text-sm">
                    <span className="text-purple-300 font-medium">Query:</span>
                    <span className="text-gray-300 flex-1">{quote.source_query}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Themes */}
      <div className="bg-black/20 rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🏷️</span>
          Common Themes
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {insights.themes.map((theme, idx) => (
            <div key={idx} className={`p-4 rounded-lg border ${getSentimentColor(theme.sentiment)}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-white">{theme.theme}</h4>
                <div className="flex items-center gap-2">
                  <span className="bg-black/30 px-2 py-1 rounded text-xs text-gray-300">
                    {theme.mentions} mentions
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    theme.sentiment === 'positive' ? 'bg-green-600/20 text-green-300' :
                    theme.sentiment === 'negative' ? 'bg-red-600/20 text-red-300' :
                    'bg-yellow-600/20 text-yellow-300'
                  }`}>
                    {theme.sentiment}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                {theme.examples.map((example, exIdx) => (
                  <div key={exIdx} className="text-gray-300 text-sm flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">•</span>
                    <span>{example}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths, Weaknesses, Opportunities */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-green-900/20 rounded-xl p-6 border border-green-500/20">
          <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
            <span>💪</span>
            Strengths
          </h3>
          <ul className="space-y-2">
            {insights.strengthsWeaknesses.strengths.map((strength, idx) => (
              <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-red-900/20 rounded-xl p-6 border border-red-500/20">
          <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
            <span>⚠️</span>
            Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {insights.strengthsWeaknesses.weaknesses.map((weakness, idx) => (
              <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                <span className="text-red-400 mt-0.5">→</span>
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-500/20">
          <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
            <span>🚀</span>
            Opportunities
          </h3>
          <ul className="space-y-2">
            {insights.strengthsWeaknesses.opportunities.map((opportunity, idx) => (
              <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">◆</span>
                <span>{opportunity}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const ResponsesView = ({ platform }: { platform: PlatformAnalysis }) => {
  const [selectedResponse, setSelectedResponse] = useState<number | null>(null);

  return (
    <div className="bg-black/20 rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span className={platform.platform === 'openai' ? 'text-blue-400' : 'text-purple-400'}>
          {platform.platform === 'openai' ? '🤖' : '🐺'}
        </span>
        {platform.platform.toUpperCase()} Responses
      </h3>
      
      <div className="space-y-3">
        {platform.responses.map((response, idx) => (
          <div key={idx} className="bg-black/30 rounded-lg p-3">
            <div 
              className="flex items-start justify-between cursor-pointer"
              onClick={() => setSelectedResponse(selectedResponse === idx ? null : idx)}
            >
              <h4 className="text-white text-sm font-medium flex-1">{response.query}</h4>
              <div className="flex items-center gap-2 ml-4">
                <span className="text-gray-400 text-xs">{response.processingTime}ms</span>
                <span className="text-gray-400 text-xs">
                  {selectedResponse === idx ? '▼' : '▶'}
                </span>
              </div>
            </div>
            
            {selectedResponse === idx && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  {response.response}
                </p>
                
                {response.sources && response.sources.length > 0 && (
                  <div>
                    <h5 className="text-purple-300 text-xs font-medium mb-2">Sources ({response.sources.length}):</h5>
                    <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                      {response.sources.slice(0, 5).map((source, sourceIdx) => (
                        <div key={sourceIdx} className="bg-black/40 rounded p-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              source.type === 'web' ? 'bg-blue-600/20 text-blue-300' : 
                              'bg-purple-600/20 text-purple-300'
                            }`}>
                              {source.type}
                            </span>
                            <span className="text-white text-xs font-medium truncate">
                              {source.title}
                            </span>
                          </div>
                          <p className="text-gray-400 text-xs truncate">{source.snippet}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

interface ProgressLogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  platform?: string;
  step?: string;
}

export default function GeoXScoreDashboard({ onClose }: GeoXScoreDashboardProps) {
  const [brandName, setBrandName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<('openai' | 'grok')[]>(['openai', 'grok']);
  const [results, setResults] = useState<SentimentAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'responses'>('overview');
  const [progressLog, setProgressLog] = useState<ProgressLogEntry[]>([]);
  const [currentStep, setCurrentStep] = useState<string>('');
  const progressLogRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of progress log
  useEffect(() => {
    if (progressLogRef.current) {
      progressLogRef.current.scrollTop = progressLogRef.current.scrollHeight;
    }
  }, [progressLog]);

  // Helper function to add progress log entries
  const addProgressLog = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', platform?: string, step?: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry: ProgressLogEntry = { timestamp, message, type, platform, step };
    setProgressLog(prev => [...prev, logEntry]);
  };

  // Helper function to clear progress log
  const clearProgressLog = () => {
    setProgressLog([]);
    setCurrentStep('');
  };

  const metricConfigs = [
    { key: 'quality', label: 'Quality', icon: '⭐', color: 'from-yellow-600/20 to-yellow-500/20' },
    { key: 'value', label: 'Value', icon: '💰', color: 'from-green-600/20 to-green-500/20' },
    { key: 'trust', label: 'Trust', icon: '🛡️', color: 'from-blue-600/20 to-blue-500/20' },
    { key: 'customerExperience', label: 'Customer Experience', icon: '😊', color: 'from-pink-600/20 to-pink-500/20' },
    { key: 'brandReputation', label: 'Brand Reputation', icon: '🏆', color: 'from-purple-600/20 to-purple-500/20' },
    { key: 'innovation', label: 'Innovation', icon: '🚀', color: 'from-indigo-600/20 to-indigo-500/20' },
    { key: 'sustainability', label: 'Sustainability', icon: '🌱', color: 'from-emerald-600/20 to-emerald-500/20' },
    { key: 'emotionalConnection', label: 'Emotional Connection', icon: '❤️', color: 'from-red-600/20 to-red-500/20' }
  ];

  const runAnalysis = async () => {
    if (!brandName.trim()) {
      setError('Please enter a brand name');
      return;
    }

    if (selectedPlatforms.length === 0) {
      setError('Please select at least one platform');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResults(null);
    clearProgressLog();

    try {
      // Start logging
      addProgressLog('🚀 Starting GEO-X brand sentiment analysis', 'info');
      addProgressLog(`📊 Analyzing brand: ${brandName.trim()}`, 'info');
      addProgressLog(`🤖 Selected platforms: ${selectedPlatforms.join(', ').toUpperCase()}`, 'info');
      addProgressLog('🔄 Generating brand sentiment queries...', 'info');
      
      const startTime = Date.now();
      setCurrentStep('Initializing analysis...');

      // Simulate progress for the queries being generated
      await new Promise(resolve => setTimeout(resolve, 500));
      addProgressLog('✅ Generated 8 brand sentiment queries', 'success');
      
      // Show the actual queries being generated
      const queryTypes = [
        '🏭 Product quality & reliability',
        '💵 Value proposition & pricing', 
        '🛡️ Brand trust & consistency',
        '😊 Customer experience & satisfaction',
        '🏆 Market reputation & loyalty',
        '🚀 Innovation & technology advancement',
        '🌱 Sustainability & ethics',
        '❤️ Emotional connection & advocacy'
      ];
      
      for (let i = 0; i < queryTypes.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        addProgressLog(`📝 ${queryTypes[i]}`, 'info');
      }
      
      addProgressLog('📡 Sending requests to AI platforms...', 'info');
      setCurrentStep('Querying AI platforms...');
      
      // Show platform-specific steps
      if (selectedPlatforms.includes('openai')) {
        addProgressLog('🤖 Connecting to OpenAI GPT-4...', 'info', 'openai');
      }
      if (selectedPlatforms.includes('grok')) {
        addProgressLog('🐺 Connecting to Grok (X AI)...', 'info', 'grok');
      }

      const response = await fetch('/api/geo-x/sentiment-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brandName: brandName.trim(),
          queries: [],
          platforms: selectedPlatforms
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        addProgressLog(`❌ API request failed: ${errorData.error || `HTTP ${response.status}`}`, 'error');
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      setCurrentStep('Processing AI responses...');
      addProgressLog('📥 Received responses from AI platforms', 'success');
      addProgressLog('🧠 Running sentiment analysis on responses...', 'info');

      const data: SentimentAnalysisResponse = await response.json();
      
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(1);
      
      addProgressLog('✨ Generating metric scores and insights...', 'info');
      addProgressLog('📈 Creating platform comparisons...', 'info');
      addProgressLog('💬 Extracting key quotes and qualitative insights...', 'info');
      addProgressLog(`🎉 Analysis complete! Total time: ${duration}s`, 'success');
      
      // Add platform-specific results
      data.platforms.forEach(platform => {
        const avgScore = platform.overallSentiment.score;
        const emoji = avgScore >= 7 ? '🟢' : avgScore >= 4 ? '🟡' : '🔴';
        addProgressLog(
          `${emoji} ${platform.platform.toUpperCase()}: ${avgScore.toFixed(1)}/10 (${platform.overallSentiment.sentiment})`, 
          'success', 
          platform.platform
        );
      });

      setResults(data);
      setActiveTab('overview');
      setCurrentStep('Analysis complete!');
      
    } catch (err) {
      console.error('Analysis failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      addProgressLog(`❌ Analysis failed: ${errorMessage}`, 'error');
      setError(errorMessage);
      setCurrentStep('Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <span>📊</span>
          Your GEO-X Score Dashboard
        </h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white text-2xl transition-colors duration-200"
        >
          ✕
        </button>
      </div>

      {/* Setup Form */}
      <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 mb-8">
        <h3 className="text-xl font-semibold text-white mb-6">Configure Analysis</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Brand Name</label>
            <input 
              type="text" 
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g., Nike, Apple, Tesla"
              className="w-full p-3 rounded-lg bg-black/30 border border-purple-400/30 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
              disabled={isAnalyzing}
            />
          </div>
          
          <div>
            <label className="block text-white text-sm font-medium mb-2">Platforms to Analyze</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={selectedPlatforms.includes('openai')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPlatforms([...selectedPlatforms, 'openai']);
                    } else {
                      setSelectedPlatforms(selectedPlatforms.filter(p => p !== 'openai'));
                    }
                  }}
                  className="rounded text-blue-400"
                  disabled={isAnalyzing}
                />
                <span className="text-white">OpenAI (GPT-4)</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={selectedPlatforms.includes('grok')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPlatforms([...selectedPlatforms, 'grok']);
                    } else {
                      setSelectedPlatforms(selectedPlatforms.filter(p => p !== 'grok'));
                    }
                  }}
                  className="rounded text-purple-400"
                  disabled={isAnalyzing}
                />
                <span className="text-white">Grok (X AI)</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-6">
          <button 
            onClick={runAnalysis}
            disabled={!brandName.trim() || selectedPlatforms.length === 0 || isAnalyzing}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? 'Analyzing Brand Sentiment...' : 'Run GEO-X Analysis'}
          </button>
          
          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 px-4 py-2 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {isAnalyzing && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                <span className="text-gray-300">{currentStep}</span>
              </div>
            </div>
            
            {/* Progress Log */}
            <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20 max-h-64 overflow-y-auto" ref={progressLogRef}>
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span>📝</span>
                Analysis Progress Log
              </h4>
              <div className="space-y-2 font-mono text-sm">
                {progressLog.map((entry, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start gap-3 ${
                      entry.type === 'success' ? 'text-green-400' :
                      entry.type === 'error' ? 'text-red-400' :
                      entry.type === 'warning' ? 'text-yellow-400' :
                      'text-gray-300'
                    }`}
                  >
                    <span className="text-gray-500 text-xs min-w-[60px]">{entry.timestamp}</span>
                    <span className="flex-1">{entry.message}</span>
                    {entry.platform && (
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        entry.platform === 'openai' ? 'bg-blue-600/20 text-blue-300' : 'bg-purple-600/20 text-purple-300'
                      }`}>
                        {entry.platform.toUpperCase()}
                      </span>
                    )}
                  </div>
                ))}
                {progressLog.length === 0 && (
                  <div className="text-gray-500 italic">Initializing...</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {results && (
        <div>
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'overview' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-black/20 text-gray-300 hover:text-white'
              }`}
            >
              📊 Overview
            </button>
            <button 
              onClick={() => setActiveTab('insights')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'insights' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-black/20 text-gray-300 hover:text-white'
              }`}
            >
              💬 Key Insights & Quotes
            </button>
            <button 
              onClick={() => setActiveTab('responses')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'responses' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-black/20 text-gray-300 hover:text-white'
              }`}
            >
              📝 Detailed Responses
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Overall Scores */}
              <div className="bg-gradient-to-br from-black/40 to-purple-900/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  🎯 Overall Brand Sentiment
                </h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {results.platforms.map((platform) => (
                    <div key={platform.platform} className={`bg-gradient-to-br ${
                      platform.platform === 'openai' ? 'from-blue-600/20 to-blue-500/10' : 'from-purple-600/20 to-purple-500/10'
                    } backdrop-blur-sm rounded-xl p-6 border border-white/10`}>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-white font-semibold flex items-center gap-2">
                          <span>{platform.platform === 'openai' ? '🤖' : '🐺'}</span>
                          {platform.platform.toUpperCase()}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          platform.overallSentiment.sentiment === 'positive' 
                            ? 'bg-green-600/20 text-green-300'
                            : platform.overallSentiment.sentiment === 'neutral'
                            ? 'bg-yellow-600/20 text-yellow-300'
                            : 'bg-red-600/20 text-red-300'
                        }`}>
                          {platform.overallSentiment.sentiment}
                        </span>
                      </div>
                      
                      <div className="text-center">
                        <div className={`text-4xl font-bold mb-2 ${
                          platform.overallSentiment.score >= 7 ? 'text-green-400' :
                          platform.overallSentiment.score >= 4 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {platform.overallSentiment.score.toFixed(1)}
                        </div>
                        <p className="text-gray-300 text-sm">
                          {(platform.overallSentiment.confidence * 100).toFixed(0)}% confidence
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Metrics Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {results.platforms[0] && metricConfigs.map((config) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const metrics = results.platforms[0].metrics as Record<string, any>;
                    return (
                      <MetricCard
                        key={config.key}
                        name={config.label}
                        score={metrics[config.key].score}
                        reasoning={metrics[config.key].reasoning}
                        examples={metrics[config.key].examples}
                        icon={config.icon}
                        color={config.color}
                      />
                    );
                  })}
                </div>

                {/* Platform Comparison */}
                {results.platforms.length > 1 && (
                  <PlatformComparison platforms={results.platforms} />
                )}
              </div>

              {/* Recommendations */}
              <div className="bg-black/20 rounded-xl p-6 border border-green-500/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  💡 Strategic Recommendations
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                      <span>💪</span>
                      Strongest Metrics
                    </h4>
                    <ul className="space-y-1">
                      {results.comparison.strongestMetrics.map((metric, idx) => (
                        <li key={idx} className="text-gray-300 text-sm flex items-center gap-2">
                          <span className="text-green-400">✓</span>
                          {metricConfigs.find(c => c.key === metric)?.label || metric}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                      <span>⚠️</span>
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-1">
                      {results.comparison.weakestMetrics.map((metric, idx) => (
                        <li key={idx} className="text-gray-300 text-sm flex items-center gap-2">
                          <span className="text-red-400">→</span>
                          {metricConfigs.find(c => c.key === metric)?.label || metric}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
                    <span>🎯</span>
                    Action Items
                  </h4>
                  <div className="grid gap-3">
                    {results.comparison.recommendations.map((rec, idx) => (
                      <div key={idx} className="bg-blue-900/20 rounded-lg p-3 border-l-4 border-blue-400">
                        <p className="text-gray-300 text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <QualitativeInsightsView platforms={results.platforms} />
          )}

          {activeTab === 'responses' && (
            <div className="space-y-6">
              {results.platforms.map((platform) => (
                <ResponsesView key={platform.platform} platform={platform} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}