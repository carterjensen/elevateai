'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import SourcesDisplay from '@/components/SourcesDisplay';

interface Source {
  type: 'web' | 'twitter' | 'ex';
  title: string;
  url: string;
  snippet: string;
  author?: string;
  date?: string;
  profile_image?: string;
  verified?: boolean;
  engagement?: {
    likes?: number;
    retweets?: number;
    replies?: number;
  };
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  sources?: Source[];
}

interface Persona {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

interface Brand {
  id: string;
  name: string;
  description: string;
  tone: string;
  logo: string;
}

// Data will be loaded from centralized APIs

export default function BrandChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected' | 'error'>('checking');
  const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load sample data from APIs
  useEffect(() => {
    const loadData = async () => {
      try {
        setDataLoading(true);
        
        // Load personas and brands in parallel
        const [personasResponse, brandsResponse] = await Promise.all([
          fetch('/api/admin/demographics'),
          fetch('/api/admin/brands')
        ]);
        
        const personasResult = await personasResponse.json();
        const brandsResult = await brandsResponse.json();
        
        if (personasResult.success && personasResult.data) {
          // Convert demographics to personas format
          const personasData = personasResult.data.map((demo: { id: string; name: string; description: string; emoji: string; }) => ({
            id: demo.id,
            name: demo.name,
            description: demo.description,
            emoji: demo.emoji
          }));
          setPersonas(personasData);
          setSelectedPersona(personasData[0]);
        }
        
        if (brandsResult.success && brandsResult.data) {
          setBrands(brandsResult.data);
          setSelectedBrand(brandsResult.data[0]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to empty arrays if API fails - user will see loading state
      } finally {
        setDataLoading(false);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check API connection status on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/status');
        const data = await response.json();
        setConnectionStatus(data.status);
        
        // Store additional info for enhanced status display
        if (data.service && data.features) {
          setConnectionStatus(data.status);
        }
      } catch {
        setConnectionStatus('error');
      }
    };

    checkConnection();
    
    // Check connection status every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          persona: selectedPersona,
          brand: selectedBrand,
          chatHistory: messages
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      // Use streaming animation
      animateStreamingText(data.response, (fullText) => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: fullText,
          role: 'assistant',
          timestamp: new Date(),
          sources: data.sources
        };
        setMessages(prev => [...prev, assistantMessage]);
      });
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as React.FormEvent);
    }
  };

  // Fast streaming animation function
  const animateStreamingText = (text: string, callback: (fullText: string) => void) => {
    setIsStreaming(true);
    setStreamingText('');
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setStreamingText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsStreaming(false);
        callback(text);
        setStreamingText('');
      }
    }, 15); // Very fast - 15ms per character
  };

  // Export to CSV
  const exportToCSV = () => {
    const csvContent = [
      ['Timestamp', 'Role', 'Persona', 'Brand', 'Content', 'Sources Count', 'Source URLs'],
      ...messages.map(msg => [
        msg.timestamp.toISOString(),
        msg.role,
        msg.role === 'assistant' ? (selectedPersona?.name || 'Assistant') : 'User',
        selectedBrand?.name || 'Brand',
        `"${msg.content.replace(/"/g, '""')}"`,
        msg.sources?.length || 0,
        msg.sources?.map(s => s.url).join('; ') || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brandchat-${selectedPersona?.name || 'persona'}-${selectedBrand?.name || 'brand'}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportDropdown(false);
  };

  // Export to Markdown
  const exportToMarkdown = () => {
    const mdContent = [
      `# BrandChat: ${selectedPersona?.name || 'Persona'} × ${selectedBrand?.name || 'Brand'}`,
      ``,
      `**Date:** ${new Date().toLocaleDateString()}`,
      `**Persona:** ${selectedPersona?.name || 'Persona'} (${selectedPersona?.description || 'Description'})`,
      `**Brand:** ${selectedBrand?.name || 'Brand'} (${selectedBrand?.description || 'Description'})`,
      `**Enhanced with:** Grok AI + Web Search + X (Twitter) Search`,
      ``,
      `---`,
      ``,
      ...messages.map(msg => {
        const messageParts = [
          `## ${msg.role === 'user' ? '👤 User' : `${selectedPersona?.emoji || '🤖'} ${selectedPersona?.name || 'Assistant'}`}`,
          `*${msg.timestamp.toLocaleString()}*`,
          ``,
          msg.content,
          ``
        ];
        
        // Add sources if available
        if (msg.sources && msg.sources.length > 0) {
          messageParts.push(`### Sources (${msg.sources.length})`);
          messageParts.push(``);
          msg.sources.forEach((source, index) => {
            messageParts.push(`${index + 1}. **[${source.title}](${source.url})** (${source.type})`);
            if (source.author) {
              messageParts.push(`   - Author: ${source.author}${source.verified ? ' ✓' : ''}`);
            }
            if (source.date) {
              messageParts.push(`   - Date: ${source.date}`);
            }
            messageParts.push(`   - ${source.snippet}`);
            messageParts.push(``);
          });
        }
        
        return messageParts.join('\n');
      })
    ].join('\n');

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brandchat-${selectedPersona?.name || 'persona'}-${selectedBrand?.name || 'brand'}-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportDropdown(false);
  };


  // Show loading state while data is loading
  if (dataLoading || !selectedPersona || !selectedBrand) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
          </svg>
        </div>
        <p className="text-gray-600 text-lg">Loading ElevateAI BrandChat...</p>
        <p className="text-gray-400 text-sm mt-2">Connecting to sample data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Navigation and Dropdowns */}
      <header className="nav-primary border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Brand and dropdowns */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <h1 className="text-xl font-bold">ElevateAI</h1>
              </Link>
              
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-green-600 font-semibold">BrandChat</span>
              </div>

              {/* Persona Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowPersonaDropdown(!showPersonaDropdown);
                    setShowBrandDropdown(false);
                    setShowExportDropdown(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border-2 border-blue-200"
                >
                  <span>{selectedPersona.emoji}</span>
                  <span className="font-medium">{selectedPersona.name}</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
                
                {showPersonaDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-20">
                    <div className="p-2 max-h-96 overflow-y-auto">
                      <div className="text-sm font-semibold text-gray-900 px-3 py-2">Choose Persona</div>
                      {personas.map((persona) => (
                        <button
                          key={persona.id}
                          onClick={() => {
                            setSelectedPersona(persona);
                            setShowPersonaDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors ${
                            selectedPersona.id === persona.id ? 'bg-blue-50 border-l-4 border-blue-400' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xl">{persona.emoji}</span>
                            <div>
                              <div className="font-medium text-gray-900">{persona.name}</div>
                              <div className="text-sm text-gray-600">{persona.description}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                      <div className="border-t border-gray-200 mt-2 pt-2">
                        <Link 
                          href="/admin/demographics" 
                          onClick={() => setShowPersonaDropdown(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add New Persona
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Brand Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowBrandDropdown(!showBrandDropdown);
                    setShowPersonaDropdown(false);
                    setShowExportDropdown(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors border-2 border-purple-200"
                >
                  <span>{selectedBrand.logo}</span>
                  <span className="font-medium">{selectedBrand.name}</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
                
                {showBrandDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-20">
                    <div className="p-2 max-h-96 overflow-y-auto">
                      <div className="text-sm font-semibold text-gray-900 px-3 py-2">Choose Brand</div>
                      {brands.map((brand) => (
                        <button
                          key={brand.id}
                          onClick={() => {
                            setSelectedBrand(brand);
                            setShowBrandDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors ${
                            selectedBrand.id === brand.id ? 'bg-purple-50 border-l-4 border-purple-400' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xl">{brand.logo}</span>
                            <div>
                              <div className="font-medium text-gray-900">{brand.name}</div>
                              <div className="text-sm text-gray-600">{brand.description}</div>
                              <div className="text-xs text-gray-500 mt-1">Tone: {brand.tone}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                      <div className="border-t border-gray-200 mt-2 pt-2">
                        <Link 
                          href="/admin/brands" 
                          onClick={() => setShowBrandDropdown(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add New Brand
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Actions and Export */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMessages([])}
                className="btn btn-ghost"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Chat
              </button>

              {/* Export Dropdown */}
              {messages.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowExportDropdown(!showExportDropdown);
                      setShowPersonaDropdown(false);
                      setShowBrandDropdown(false);
                    }}
                    className="btn btn-secondary"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Chat
                  </button>
                  
                  {showExportDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-20">
                      <div className="p-2">
                        <button
                          onClick={exportToCSV}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Export as CSV
                        </button>
                        <button
                          onClick={exportToMarkdown}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          Export as Markdown
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Enhanced Connection Status */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-green-500' :
                    connectionStatus === 'checking' ? 'bg-yellow-500 animate-pulse' :
                    'bg-red-500'
                  }`}></div>
                  <span className={`font-medium ${
                    connectionStatus === 'connected' ? 'text-green-600' :
                    connectionStatus === 'checking' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {connectionStatus === 'connected' ? 'Grok AI' :
                     connectionStatus === 'checking' ? 'Connecting...' :
                     'Disconnected'}
                  </span>
                </div>
                
                {connectionStatus === 'connected' && (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    <span>Enhanced</span>
                  </div>
                )}
              </div>

              <Link href="/admin" className="nav-link text-sm">Admin</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="chat-main">
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 animate-float">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Ready to explore brand insights</h3>
              <p className="text-gray-600 mb-4 max-w-md">
                Chat with <span className="font-semibold text-blue-600">{selectedPersona.name}</span> about <span className="font-semibold text-purple-600">{selectedBrand.name}</span> to understand consumer perspectives.
              </p>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-6 max-w-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-green-800">Enhanced with Grok AI</span>
                </div>
                <div className="text-sm text-green-700 space-y-1">
                  <div>• Real-time web search integration</div>
                  <div>• Live X (Twitter) social insights</div>
                  <div>• Up to 20 sources per response</div>
                  <div>• Beautiful markdown formatting</div>
                </div>
              </div>
              <div className="text-sm text-gray-500 max-w-lg">
                Ask about current trends, recent campaigns, social media buzz, or get authentic persona-based insights with real-time data.
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div key={message.id} className={`chat-message ${message.role}`}>
                  <div className={`chat-avatar ${message.role}`}>
                    {message.role === 'user' ? (
                      'U'
                    ) : (
                      selectedPersona.emoji
                    )}
                  </div>
                  <div className="chat-content">
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2 text-sm opacity-75">
                        <span className="font-medium">{selectedPersona.name}</span>
                        <span>•</span>
                        <span>{selectedBrand.name}</span>
                        {message.sources && message.sources.length > 0 && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                              </svg>
                              <span className="text-green-600 font-medium">Enhanced with sources</span>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    {message.role === 'assistant' ? (
                      <div>
                        <MarkdownRenderer content={message.content} />
                        {message.sources && message.sources.length > 0 && (
                          <SourcesDisplay sources={message.sources} className="mt-4" />
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-900">{message.content}</div>
                    )}
                  </div>
                </div>
              ))}
              
              {(isLoading || isStreaming) && (
                <div className="chat-message assistant">
                  <div className="chat-avatar assistant">
                    {selectedPersona.emoji}
                  </div>
                  <div className="chat-content">
                    <div className="flex items-center gap-2 mb-2 text-sm opacity-75">
                      <span className="font-medium">{selectedPersona.name}</span>
                      <span>•</span>
                      <span>{selectedBrand.name}</span>
                    </div>
                    {isStreaming ? (
                      <div className="streaming-text">
                        <MarkdownRenderer content={streamingText} />
                        <span className="animate-pulse text-blue-500 ml-1">|</span>
                      </div>
                    ) : (
                      <div className="typing-indicator">
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <form onSubmit={handleSubmit}>
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${selectedPersona.name} about ${selectedBrand.name}...`}
                className="chat-input"
                rows={1}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="chat-send-button"
              >
                {isLoading ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}