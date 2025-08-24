'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SystemPrompt {
  id: string;
  name: string;
  type: 'persona' | 'brand' | 'system';
  prompt_template: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface TestMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [prompts, setPrompts] = useState<SystemPrompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<SystemPrompt | null>(null);
  const [editedPrompt, setEditedPrompt] = useState('');
  const [testMessages, setTestMessages] = useState<TestMessage[]>([]);
  const [testInput, setTestInput] = useState('');
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Simple password auth for admin access
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'elevateai2024') { // Simple password - in production, use proper auth
      setIsAuthenticated(true);
      loadPrompts();
    } else {
      alert('Incorrect password');
    }
  };

  // Load all system prompts from API
  const loadPrompts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/prompts');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to load prompts');
      }
      
      setPrompts(result.data || []);
    } catch (error) {
      console.error('Error loading prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save prompt changes
  const savePrompt = async () => {
    if (!selectedPrompt) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/admin/prompts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...selectedPrompt,
          prompt_template: editedPrompt,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save prompt');
      }
      
      // Refresh prompts
      await loadPrompts();
      
      // Update selected prompt
      setSelectedPrompt(prev => prev ? {...prev, prompt_template: editedPrompt} : null);
      
      alert('Prompt saved successfully!');
    } catch (error) {
      console.error('Error saving prompt:', error);
      alert('Error saving prompt');
    } finally {
      setLoading(false);
    }
  };

  // Test the prompt with a message
  const testPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim() || !selectedPrompt) return;

    const userMessage: TestMessage = {
      id: Date.now().toString(),
      content: testInput,
      role: 'user',
      timestamp: new Date()
    };

    setTestMessages(prev => [...prev, userMessage]);
    setTestInput('');
    setIsTestLoading(true);

    try {
      // Use default persona and brand for testing
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: testInput,
          persona: { id: 'gen-z', name: 'Gen Z Consumer', description: 'Ages 18-26, digital native, values authenticity', emoji: '🎮' },
          brand: { id: 'apple', name: 'Apple', description: 'Premium technology with minimalist design', tone: 'Sleek, innovative, premium', logo: '🍎' },
          chatHistory: testMessages,
          useCustomPrompt: true,
          customPromptId: selectedPrompt.id
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');
      
      const data = await response.json();
      
      const assistantMessage: TestMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date()
      };

      setTestMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error testing prompt:', error);
      const errorMessage: TestMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Error testing prompt. Please check the console.',
        role: 'assistant',
        timestamp: new Date()
      };
      setTestMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTestLoading(false);
    }
  };

  // Select a prompt for editing
  const selectPrompt = (prompt: SystemPrompt) => {
    setSelectedPrompt(prompt);
    setEditedPrompt(prompt.prompt_template);
    setTestMessages([]);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Access</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter admin password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

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
              <span className="text-gray-400 mx-2">/</span>
              <span className="text-blue-600 font-semibold">Admin Dashboard</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link href="/superadmin" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold">
                Super Admin
              </Link>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Admin Navigation */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/legal" className="bg-white p-6 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Legal Compliance</h3>
                <p className="text-gray-600 text-sm">Manage legal rules and compliance settings</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Original Admin Cards */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/demographics"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">👥 Demographics</h3>
            <p className="text-gray-600">Manage target demographic groups for ad analysis</p>
          </Link>
          
          <Link
            href="/admin/brands"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🏢 Brands</h3>
            <p className="text-gray-600">Manage brand profiles and characteristics</p>
          </Link>
          
          <Link
            href="/ad-critic"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🎯 Ad Critic</h3>
            <p className="text-gray-600">Analyze advertisements with AI</p>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Prompts List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">System Prompts</h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <div className="space-y-3">
                  {prompts.map((prompt) => (
                    <button
                      key={prompt.id}
                      onClick={() => selectPrompt(prompt)}
                      className={`w-full text-left p-4 rounded-lg border transition-colors ${
                        selectedPrompt?.id === prompt.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{prompt.name}</div>
                      <div className="text-sm text-gray-600 capitalize">{prompt.type}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {prompt.is_active ? '✅ Active' : '⏸️ Inactive'}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Prompt Editor */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedPrompt ? `Edit: ${selectedPrompt.name}` : 'Select a prompt to edit'}
              </h2>
            </div>
            <div className="p-6">
              {selectedPrompt ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prompt Template
                    </label>
                    <textarea
                      value={editedPrompt}
                      onChange={(e) => setEditedPrompt(e.target.value)}
                      rows={12}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
                      placeholder="Enter your system prompt..."
                    />
                  </div>
                  
                  {selectedPrompt.variables.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Variables
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {selectedPrompt.variables.map((variable) => (
                          <code key={variable} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {variable}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={savePrompt}
                    disabled={loading || editedPrompt === selectedPrompt.prompt_template}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Saving...' : 'Save Prompt'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Select a prompt from the list to start editing
                </div>
              )}
            </div>
          </div>

          {/* Live Testing */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Live Testing</h2>
              <p className="text-sm text-gray-600 mt-1">Test your prompts in real-time</p>
            </div>
            <div className="p-6">
              {selectedPrompt ? (
                <div className="space-y-4">
                  {/* Test Messages */}
                  <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 space-y-3">
                    {testMessages.length === 0 ? (
                      <div className="text-center text-gray-500 text-sm">
                        Start a conversation to test your prompt
                      </div>
                    ) : (
                      testMessages.map((message) => (
                        <div key={message.id} className={`${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                          <div className={`inline-block max-w-xs px-3 py-2 rounded-lg text-sm ${
                            message.role === 'user' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            {message.content}
                          </div>
                        </div>
                      ))
                    )}
                    {isTestLoading && (
                      <div className="text-left">
                        <div className="inline-block bg-gray-100 px-3 py-2 rounded-lg">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Test Input */}
                  <form onSubmit={testPrompt} className="space-y-3">
                    <textarea
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Type a message to test..."
                      disabled={isTestLoading}
                    />
                    <button
                      type="submit"
                      disabled={!testInput.trim() || isTestLoading}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isTestLoading ? 'Testing...' : 'Send Test Message'}
                    </button>
                  </form>
                  
                  <button
                    onClick={() => setTestMessages([])}
                    className="w-full text-sm text-gray-600 hover:text-gray-900 py-1"
                  >
                    Clear Test Chat
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Select a prompt to start testing
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}