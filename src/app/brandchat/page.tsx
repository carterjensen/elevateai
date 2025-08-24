'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
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

const personas: Persona[] = [
  { id: 'gen-z', name: 'Gen Z Consumer', description: 'Ages 18-26, digital native, values authenticity', emoji: '🎮' },
  { id: 'millennial', name: 'Millennial Professional', description: 'Ages 27-42, career-focused, brand conscious', emoji: '💼' },
  { id: 'gen-x', name: 'Gen X Parent', description: 'Ages 43-58, family-oriented, practical', emoji: '👨‍👩‍👧‍👦' },
  { id: 'boomer', name: 'Baby Boomer', description: 'Ages 59+, traditional values, quality-focused', emoji: '👴' },
  { id: 'eco-warrior', name: 'Eco-Conscious Consumer', description: 'Sustainability-focused, willing to pay premium for green products', emoji: '🌱' },
  { id: 'tech-enthusiast', name: 'Tech Early Adopter', description: 'Loves new gadgets, influences others, high disposable income', emoji: '🚀' }
];

const brands: Brand[] = [
  { id: 'apple', name: 'Apple', description: 'Premium technology with minimalist design', tone: 'Sleek, innovative, premium', logo: '🍎' },
  { id: 'nike', name: 'Nike', description: 'Athletic performance and inspiration', tone: 'Motivational, energetic, bold', logo: '👟' },
  { id: 'tesla', name: 'Tesla', description: 'Sustainable luxury and innovation', tone: 'Futuristic, disruptive, eco-conscious', logo: '⚡' },
  { id: 'starbucks', name: 'Starbucks', description: 'Community-focused coffee experience', tone: 'Warm, inclusive, experiential', logo: '☕' },
  { id: 'patagonia', name: 'Patagonia', description: 'Outdoor gear with environmental activism', tone: 'Authentic, rugged, environmentally conscious', logo: '🏔️' },
  { id: 'netflix', name: 'Netflix', description: 'Entertainment streaming platform', tone: 'Casual, entertaining, binge-worthy', logo: '🎬' }
];

export default function BrandChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<Persona>(personas[0]);
  const [selectedBrand, setSelectedBrand] = useState<Brand>(brands[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected' | 'error'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
      } catch (error) {
        setConnectionStatus('error');
      }
    };

    checkConnection();
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

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
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

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-green-600 font-semibold">BrandChat</span>
              </div>
            </div>
          
            <div className="flex items-center gap-4">
              <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors">
                Admin
              </Link>
              <Link href="/superadmin" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold">
                Super Admin
              </Link>
              
              {/* Connection Status */}
              <div className="flex items-center gap-2 text-sm border-l border-gray-200 pl-4">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-500' :
                  connectionStatus === 'checking' ? 'bg-yellow-500 animate-pulse' :
                  'bg-red-500'
                }`}></div>
                <span className={`${
                  connectionStatus === 'connected' ? 'text-green-600' :
                  connectionStatus === 'checking' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {connectionStatus === 'connected' ? 'Grok AI Connected' :
                   connectionStatus === 'checking' ? 'Connecting...' :
                   'AI Disconnected'}
                </span>
              </div>
              
              <button
                onClick={clearChat}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Clear Chat
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Controls */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-4">
          {/* Persona Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowPersonaDropdown(!showPersonaDropdown);
                setShowBrandDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span>{selectedPersona.emoji}</span>
              <span className="font-medium">{selectedPersona.name}</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
            
            {showPersonaDropdown && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-2">
                  <div className="text-sm font-semibold text-gray-900 px-3 py-2">Choose Persona</div>
                  {personas.map((persona) => (
                    <button
                      key={persona.id}
                      onClick={() => {
                        setSelectedPersona(persona);
                        setShowPersonaDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
                        selectedPersona.id === persona.id ? 'bg-blue-50' : ''
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
              }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <span>{selectedBrand.logo}</span>
              <span className="font-medium">{selectedBrand.name}</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
            
            {showBrandDropdown && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-2">
                  <div className="text-sm font-semibold text-gray-900 px-3 py-2">Choose Brand</div>
                  {brands.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => {
                        setSelectedBrand(brand);
                        setShowBrandDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
                        selectedBrand.id === brand.id ? 'bg-purple-50' : ''
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-8">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start a conversation</h3>
                <p className="text-gray-600 mb-4">
                  Chat with <span className="font-semibold text-blue-600">{selectedPersona.name}</span> about <span className="font-semibold text-purple-600">{selectedBrand.name}</span>
                </p>
                <div className="text-sm text-gray-500 max-w-md">
                  Ask questions about how this persona would react to marketing messages, product features, or brand positioning.
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white border border-gray-200'
                    } rounded-2xl px-4 py-3 shadow-sm`}>
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                          <span>{selectedPersona.emoji}</span>
                          <span className="font-medium">{selectedPersona.name}</span>
                          <span className="text-gray-400">•</span>
                          <span>{selectedBrand.logo} {selectedBrand.name}</span>
                        </div>
                      )}
                      <div className={`${message.role === 'user' ? 'text-white' : 'text-gray-900'}`}>
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                        <span>{selectedPersona.emoji}</span>
                        <span className="font-medium">{selectedPersona.name}</span>
                        <span className="text-gray-400">•</span>
                        <span>{selectedBrand.logo} {selectedBrand.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Form */}
          <div className="border-t border-gray-200 bg-white px-6 py-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask ${selectedPersona.name} about ${selectedBrand.name}...`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={1}
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
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