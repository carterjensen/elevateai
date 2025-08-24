'use client';

import { useState } from 'react';
import Link from 'next/link';

interface LegalRule {
  id: string;
  name: string;
  category: string;
  description?: string;
  rules_content: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const categories = [
  { value: 'general', label: 'General Compliance' },
  { value: 'health', label: 'Health & Medical' },
  { value: 'financial', label: 'Financial Services' },
  { value: 'children', label: 'Children\'s Advertising' },
  { value: 'restricted', label: 'Restricted Products' },
  { value: 'privacy', label: 'Privacy & Data' },
  { value: 'custom', label: 'Custom Rules' }
];

const severityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200'
};

export default function LegalComplianceAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [rules, setRules] = useState<LegalRule[]>([]);
  const [selectedRule, setSelectedRule] = useState<LegalRule | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Form state for creating/editing rules
  const [formData, setFormData] = useState<{
    name: string;
    category: string;
    description: string;
    rules_content: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    is_active: boolean;
  }>({
    name: '',
    category: 'general',
    description: '',
    rules_content: '',
    severity: 'medium',
    is_active: true
  });

  // Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'elevateai_admin_2024') {
      setIsAuthenticated(true);
      initializeLegalSystem();
    } else {
      alert('Incorrect admin password');
    }
  };

  // Initialize legal compliance system
  const initializeLegalSystem = async () => {
    setLoading(true);
    try {
      await fetch('/api/legallens/init', { method: 'POST' });
      await loadRules();
    } catch (error) {
      console.error('Error initializing legal system:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load all legal rules
  const loadRules = async () => {
    try {
      const response = await fetch('/api/legallens/rules');
      if (!response.ok) throw new Error('Failed to load rules');
      const data = await response.json();
      setRules(data.data || []);
    } catch (error) {
      console.error('Error loading rules:', error);
    }
  };

  // Save rule (create or update)
  const saveRule = async () => {
    setLoading(true);
    try {
      const method = isCreating ? 'POST' : 'PUT';
      const body = isCreating ? formData : { ...formData, id: selectedRule?.id };

      const response = await fetch('/api/legallens/rules', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Failed to save rule');

      await loadRules();
      resetForm();
      alert('Rule saved successfully!');
    } catch (error) {
      console.error('Error saving rule:', error);
      alert('Error saving rule');
    } finally {
      setLoading(false);
    }
  };

  // Delete rule
  const deleteRule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/legallens/rules?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete rule');

      await loadRules();
      if (selectedRule?.id === id) {
        resetForm();
      }
      alert('Rule deleted successfully!');
    } catch (error) {
      console.error('Error deleting rule:', error);
      alert('Error deleting rule');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      category: 'general',
      description: '',
      rules_content: '',
      severity: 'medium',
      is_active: true
    });
    setSelectedRule(null);
    setIsEditing(false);
    setIsCreating(false);
  };

  // Select rule for editing
  const selectRule = (rule: LegalRule) => {
    setSelectedRule(rule);
    setFormData({
      name: rule.name,
      category: rule.category,
      description: rule.description || '',
      rules_content: rule.rules_content,
      severity: rule.severity,
      is_active: rule.is_active
    });
    setIsEditing(true);
    setIsCreating(false);
  };

  // Start creating new rule
  const startCreating = () => {
    resetForm();
    setIsCreating(true);
    setIsEditing(false);
  };

  // Filter rules
  const filteredRules = rules.filter(rule => {
    const matchesCategory = filterCategory === 'all' || rule.category === filterCategory;
    const matchesSearch = searchTerm === '' || 
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.rules_content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
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
                <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                  About
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
        
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">🏛️ Legal Compliance Admin</h1>
              <p className="text-gray-600">Manage legal compliance rules and regulations</p>
            </div>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter admin password"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                Access Legal Admin
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">ElevateAI</h1>
              </Link>
              <span className="text-gray-400 mx-2">/</span>
              <Link href="/admin" className="text-blue-600 hover:text-blue-700">Admin</Link>
              <span className="text-gray-400 mx-2">/</span>
              <span className="text-purple-600 font-semibold">Legal Compliance</span>
            </div>
            <div className="flex items-center gap-4">
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Legal Compliance Management</h1>
          <p className="text-gray-600">Manage legal compliance rules for advertising content analysis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rules List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              {/* Header with filters */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Compliance Rules</h2>
                <button
                  onClick={startCreating}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                >
                  + Add Rule
                </button>
              </div>

              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search rules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Rules Grid */}
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading rules...</div>
              ) : filteredRules.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No rules found. {filterCategory !== 'all' || searchTerm ? 'Try adjusting filters.' : 'Add your first rule.'}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRules.map(rule => (
                    <div
                      key={rule.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedRule?.id === rule.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => selectRule(rule)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded border ${severityColors[rule.severity]}`}>
                              {rule.severity.toUpperCase()}
                            </span>
                            {!rule.is_active && (
                              <span className="px-2 py-1 text-xs font-medium rounded border bg-gray-100 text-gray-600 border-gray-200">
                                INACTIVE
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{rule.description}</p>
                          <div className="text-xs text-gray-500">
                            Category: {categories.find(c => c.value === rule.category)?.label || rule.category}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              selectRule(rule);
                            }}
                            className="text-purple-600 hover:text-purple-700 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteRule(rule.id);
                            }}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Rule Editor */}
          <div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {isCreating ? 'Create New Rule' : isEditing ? 'Edit Rule' : 'Select a rule to edit'}
              </h2>

              {(isCreating || isEditing) && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rule Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., FDA Health Claims"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                    <select
                      value={formData.severity}
                      onChange={(e) => setFormData({...formData, severity: e.target.value as 'low' | 'medium' | 'high' | 'critical'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Brief description of the rule"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rules Content
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.rules_content}
                      onChange={(e) => setFormData({...formData, rules_content: e.target.value})}
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Detailed compliance rules and guidelines..."
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                      className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_active" className="text-sm text-gray-700">
                      Active (used in analysis)
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={saveRule}
                      disabled={loading || !formData.name || !formData.rules_content}
                      className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                    >
                      {loading ? 'Saving...' : isCreating ? 'Create Rule' : 'Update Rule'}
                    </button>
                    <button
                      onClick={resetForm}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {!isCreating && !isEditing && (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Select a rule from the list to edit, or click &quot;Add Rule&quot; to create a new one.
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Rules:</span>
                  <span className="font-semibold">{rules.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Rules:</span>
                  <span className="font-semibold text-green-600">{rules.filter(r => r.is_active).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Critical Rules:</span>
                  <span className="font-semibold text-red-600">{rules.filter(r => r.severity === 'critical').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}