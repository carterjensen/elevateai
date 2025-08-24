'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SystemPrompt {
  id: string;
  name: string;
  type: 'persona' | 'brand' | 'system';
  target_id: string;
  prompt_template: string;
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

const personas = [
  { id: 'gen-z', name: 'Gen Z Consumer', description: 'Ages 18-26, digital native, values authenticity', emoji: '🎮' },
  { id: 'millennial', name: 'Millennial Professional', description: 'Ages 27-42, career-focused, brand conscious', emoji: '💼' },
  { id: 'gen-x', name: 'Gen X Parent', description: 'Ages 43-58, family-oriented, practical', emoji: '👨‍👩‍👧‍👦' },
  { id: 'boomer', name: 'Baby Boomer', description: 'Ages 59+, traditional values, quality-focused', emoji: '👴' },
  { id: 'eco-warrior', name: 'Eco-Conscious Consumer', description: 'Sustainability-focused, willing to pay premium for green products', emoji: '🌱' },
  { id: 'tech-enthusiast', name: 'Tech Early Adopter', description: 'Loves new gadgets, influences others, high disposable income', emoji: '🚀' }
];

const brands = [
  { id: 'apple', name: 'Apple', description: 'Premium technology with minimalist design', tone: 'Sleek, innovative, premium', logo: '🍎' },
  { id: 'nike', name: 'Nike', description: 'Athletic performance and inspiration', tone: 'Motivational, energetic, bold', logo: '👟' },
  { id: 'tesla', name: 'Tesla', description: 'Sustainable luxury and innovation', tone: 'Futuristic, disruptive, eco-conscious', logo: '⚡' },
  { id: 'starbucks', name: 'Starbucks', description: 'Community-focused coffee experience', tone: 'Warm, inclusive, experiential', logo: '☕' },
  { id: 'patagonia', name: 'Patagonia', description: 'Outdoor gear with environmental activism', tone: 'Authentic, rugged, environmentally conscious', logo: '🏔️' },
  { id: 'netflix', name: 'Netflix', description: 'Entertainment streaming platform', tone: 'Casual, entertaining, binge-worthy', logo: '🎬' }
];

export default function SuperAdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'system' | 'persona' | 'brand' | 'preview'>('system');
  const [prompts, setPrompts] = useState<SystemPrompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<SystemPrompt | null>(null);
  const [editedPrompt, setEditedPrompt] = useState('');
  const [testMessages, setTestMessages] = useState<TestMessage[]>([]);
  const [testInput, setTestInput] = useState('');
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState(personas[0]);
  const [selectedBrand, setSelectedBrand] = useState(brands[0]);
  const [promptPreview, setPromptPreview] = useState<{
    systemPrompt: string | null;
    personaPrompt: string | null;
    brandPrompt: string | null;
    finalPrompt: string;
    timestamp: string;
  } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Super admin authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'elevateai_superadmin_2024') {
      setIsAuthenticated(true);
      initializePrompts();
    } else {
      alert('Incorrect super admin password');
    }
  };

  // Initialize prompts system
  const initializePrompts = async () => {
    setLoading(true);
    try {
      // First, initialize the system if needed
      await fetch('/api/superadmin/init', { method: 'POST' });
      
      // Then load all prompts
      await loadPrompts();
    } catch (error) {
      console.error('Error initializing:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load prompts from Supabase
  const loadPrompts = async () => {
    try {
      const response = await fetch('/api/superadmin/prompts');
      if (!response.ok) throw new Error('Failed to load prompts');
      
      const data = await response.json();
      setPrompts(data);
    } catch (error) {
      console.error('Error loading prompts:', error);
    }
  };

  // Save prompt changes
  const savePrompt = async () => {
    if (!selectedPrompt) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/superadmin/prompts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedPrompt.id,
          prompt_template: editedPrompt
        })
      });

      if (!response.ok) throw new Error('Failed to save prompt');
      
      await loadPrompts();
      setSelectedPrompt(prev => prev ? {...prev, prompt_template: editedPrompt} : null);
      alert('Prompt saved successfully!');
    } catch (error) {
      console.error('Error saving prompt:', error);
      alert('Error saving prompt');
    } finally {
      setLoading(false);
    }
  };

  // Test the prompt
  const testPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim()) return;

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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: testInput,
          persona: selectedPersona,
          brand: selectedBrand,
          chatHistory: testMessages
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

  // Get filtered prompts based on active tab
  const getFilteredPrompts = () => {
    return prompts.filter(prompt => prompt.type === activeTab);
  };

  // Select a prompt for editing
  const selectPrompt = (prompt: SystemPrompt) => {
    setSelectedPrompt(prompt);
    setEditedPrompt(prompt.prompt_template);
    setTestMessages([]);
  };

  // Generate prompt preview
  const generatePreview = async () => {
    setPreviewLoading(true);
    try {
      const response = await fetch('/api/superadmin/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona_id: selectedPersona.id,
          brand_id: selectedBrand.id
        })
      });

      if (!response.ok) throw new Error('Failed to generate preview');
      
      const data = await response.json();
      setPromptPreview(data.data);
    } catch (error) {
      console.error('Error generating preview:', error);
      alert('Error generating preview');
    } finally {
      setPreviewLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full border border-gray-700">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-4.25 4.25a1 1 0 01-1.414-1.414L8.586 12.5A6 6 0 1118 8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">🔐 Super Admin Access</h1>
            <p className="text-gray-400">High-level system prompt management</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Super Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter super admin password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Access Super Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation Header */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <h1 className="text-xl font-bold text-white">ElevateAI</h1>
              </Link>
              <span className="text-gray-500 mx-2">/</span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-4.25 4.25a1 1 0 01-1.414-1.414L8.586 12.5A6 6 0 1118 8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-red-400 font-semibold">Super Admin</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 bg-red-900 text-red-300 rounded-full text-sm">
                System-Level Access
              </div>
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/admin" className="text-gray-400 hover:text-blue-400 transition-colors">
                Admin
              </Link>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Tab Navigation */}
      <div className="bg-gray-800 border-b border-gray-700 px-6">
        <nav className="flex space-x-8">
          {[
            { key: 'system', label: 'System Prompts', icon: '⚙️' },
            { key: 'persona', label: 'Persona Prompts', icon: '👥' },
            { key: 'brand', label: 'Brand Prompts', icon: '🏢' },
            { key: 'preview', label: 'Prompt Preview', icon: '🔍' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'system' | 'persona' | 'brand' | 'preview')}
              className={`px-4 py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.key
                  ? 'border-red-500 text-red-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'preview' ? (
          // Prompt Preview Layout
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preview Controls */}
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-lg font-semibold">🔍 Live Prompt Preview</h2>
                <p className="text-sm text-gray-400 mt-1">
                  See exactly what&apos;s being sent to Grok AI
                </p>
              </div>
              <div className="p-6 space-y-4">
                {/* Persona/Brand Selectors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Persona</label>
                    <select 
                      value={selectedPersona.id}
                      onChange={(e) => setSelectedPersona(personas.find(p => p.id === e.target.value) || personas[0])}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm"
                    >
                      {personas.map(persona => (
                        <option key={persona.id} value={persona.id}>
                          {persona.emoji} {persona.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Brand</label>
                    <select 
                      value={selectedBrand.id}
                      onChange={(e) => setSelectedBrand(brands.find(b => b.id === e.target.value) || brands[0])}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm"
                    >
                      {brands.map(brand => (
                        <option key={brand.id} value={brand.id}>
                          {brand.logo} {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={generatePreview}
                  disabled={previewLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-semibold"
                >
                  {previewLoading ? 'Generating Preview...' : 'Generate Prompt Preview'}
                </button>

                {promptPreview && (
                  <div className="space-y-4 mt-6">
                    <div className="bg-gray-900 border border-gray-600 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">Prompt Breakdown:</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">System Prompt:</span>
                          <span className={promptPreview.systemPrompt ? 'text-green-400' : 'text-red-400'}>
                            {promptPreview.systemPrompt ? '✓ Active' : '✗ Missing'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Persona Prompt:</span>
                          <span className={promptPreview.personaPrompt ? 'text-green-400' : 'text-yellow-400'}>
                            {promptPreview.personaPrompt ? '✓ Active' : '○ Default'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Brand Prompt:</span>
                          <span className={promptPreview.brandPrompt ? 'text-green-400' : 'text-yellow-400'}>
                            {promptPreview.brandPrompt ? '✓ Active' : '○ Default'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      Generated: {new Date(promptPreview.timestamp).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Preview Output */}
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-lg font-semibold">📄 Final Prompt Sent to API</h2>
                <p className="text-sm text-gray-400 mt-1">
                  This is the exact system prompt sent to Grok AI
                </p>
              </div>
              <div className="p-6">
                {promptPreview ? (
                  <div className="space-y-4">
                    <textarea
                      value={promptPreview.finalPrompt}
                      readOnly
                      rows={20}
                      className="w-full px-3 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
                    />
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Characters: {promptPreview.finalPrompt.length}</span>
                      <span>Lines: {promptPreview.finalPrompt.split('\n').length}</span>
                    </div>
                    
                    <button
                      onClick={() => navigator.clipboard.writeText(promptPreview.finalPrompt)}
                      className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                    >
                      📋 Copy Final Prompt
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-1a1 1 0 00-1-1H9a1 1 0 00-1 1v1a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <p>Generate a preview to see the final prompt</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Original Prompt Management Layout
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Prompts List */}
          <div className="lg:col-span-4 bg-gray-800 rounded-xl border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-lg font-semibold">{activeTab === 'system' ? 'System' : activeTab === 'persona' ? 'Persona' : 'Brand'} Prompts</h2>
              <p className="text-sm text-gray-400 mt-1">
                {activeTab === 'system' && 'Core system behavior and instructions'}
                {activeTab === 'persona' && 'Consumer persona-specific prompts'}
                {activeTab === 'brand' && 'Brand-specific tone and messaging'}
              </p>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-4 text-gray-400">Loading...</div>
              ) : (
                <div className="space-y-3">
                  {getFilteredPrompts().map((prompt) => (
                    <button
                      key={prompt.id}
                      onClick={() => selectPrompt(prompt)}
                      className={`w-full text-left p-4 rounded-lg border transition-colors ${
                        selectedPrompt?.id === prompt.id
                          ? 'border-red-500 bg-red-900/20'
                          : 'border-gray-700 hover:bg-gray-700'
                      }`}
                    >
                      <div className="font-medium">{prompt.name}</div>
                      <div className="text-sm text-gray-400 mt-1">
                        Target: {prompt.target_id || 'All'}
                      </div>
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
          <div className="lg:col-span-5 bg-gray-800 rounded-xl border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-lg font-semibold">
                {selectedPrompt ? `Edit: ${selectedPrompt.name}` : 'Select a prompt to edit'}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                System-level prompt engineering
              </p>
            </div>
            <div className="p-6">
              {selectedPrompt ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Prompt Template
                    </label>
                    <textarea
                      value={editedPrompt}
                      onChange={(e) => setEditedPrompt(e.target.value)}
                      rows={16}
                      className="w-full px-3 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm font-mono focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter your system prompt..."
                    />
                  </div>
                  
                  <div className="bg-gray-900 border border-gray-600 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Available Variables</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <code className="px-2 py-1 bg-gray-700 text-gray-300 rounded">{'\{persona_name\}'}</code>
                      <code className="px-2 py-1 bg-gray-700 text-gray-300 rounded">{'\{persona_description\}'}</code>
                      <code className="px-2 py-1 bg-gray-700 text-gray-300 rounded">{'\{brand_name\}'}</code>
                      <code className="px-2 py-1 bg-gray-700 text-gray-300 rounded">{'\{brand_description\}'}</code>
                      <code className="px-2 py-1 bg-gray-700 text-gray-300 rounded">{'\{brand_tone\}'}</code>
                    </div>
                  </div>
                  
                  <button
                    onClick={savePrompt}
                    disabled={loading || editedPrompt === selectedPrompt.prompt_template}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                  >
                    {loading ? 'Saving...' : 'Save System Prompt'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-1a1 1 0 00-1-1H9a1 1 0 00-1 1v1a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  Select a prompt from the list to start editing
                </div>
              )}
            </div>
          </div>

          {/* Live Testing */}
          <div className="lg:col-span-3 bg-gray-800 rounded-xl border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-lg font-semibold">Live Testing</h2>
              <p className="text-sm text-gray-400 mt-1">Test prompts in real-time</p>
            </div>
            <div className="p-6">
              {selectedPrompt ? (
                <div className="space-y-4">
                  {/* Persona/Brand Selectors */}
                  <div className="space-y-2">
                    <select 
                      value={selectedPersona.id}
                      onChange={(e) => setSelectedPersona(personas.find(p => p.id === e.target.value) || personas[0])}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm"
                    >
                      {personas.map(persona => (
                        <option key={persona.id} value={persona.id}>
                          {persona.emoji} {persona.name}
                        </option>
                      ))}
                    </select>
                    
                    <select 
                      value={selectedBrand.id}
                      onChange={(e) => setSelectedBrand(brands.find(b => b.id === e.target.value) || brands[0])}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm"
                    >
                      {brands.map(brand => (
                        <option key={brand.id} value={brand.id}>
                          {brand.logo} {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Test Messages */}
                  <div className="h-48 overflow-y-auto bg-gray-900 border border-gray-600 rounded-lg p-4 space-y-2">
                    {testMessages.length === 0 ? (
                      <div className="text-center text-gray-500 text-sm py-8">
                        Start a conversation to test your prompt
                      </div>
                    ) : (
                      testMessages.map((message) => (
                        <div key={message.id} className={`${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                          <div className={`inline-block max-w-xs px-3 py-2 rounded-lg text-sm ${
                            message.role === 'user' 
                              ? 'bg-red-600 text-white' 
                              : 'bg-gray-700 text-gray-100'
                          }`}>
                            {message.content}
                          </div>
                        </div>
                      ))
                    )}
                    {isTestLoading && (
                      <div className="text-left">
                        <div className="inline-block bg-gray-700 px-3 py-2 rounded-lg">
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
                  <form onSubmit={testPrompt} className="space-y-2">
                    <textarea
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Type a message to test..."
                      disabled={isTestLoading}
                    />
                    <button
                      type="submit"
                      disabled={!testInput.trim() || isTestLoading}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
                    >
                      {isTestLoading ? 'Testing...' : 'Test Prompt'}
                    </button>
                  </form>
                  
                  <button
                    onClick={() => setTestMessages([])}
                    className="w-full text-sm text-gray-400 hover:text-gray-300 py-1"
                  >
                    Clear Test Chat
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-12 h-12 bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  Select a prompt to start testing
                </div>
              )}
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}