'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Demographic {
  id: string;
  name: string;
  description: string;
  age_range: string;
  characteristics: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function DemographicsAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [demographics, setDemographics] = useState<Demographic[]>([]);
  const [selectedDemographic, setSelectedDemographic] = useState<Demographic | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    age_range: '',
    characteristics: [''],
    is_active: true
  });

  // Simple password auth for admin access
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'elevateai2024') {
      setIsAuthenticated(true);
      await loadDemographics();
    } else {
      alert('Incorrect password');
    }
  };

  // Load demographics from API
  const loadDemographics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/demographics');
      const result = await response.json();
      
      if (result.success) {
        setDemographics(result.data || []);
      } else {
        setError('Failed to load demographics');
      }
    } catch (error) {
      console.error('Error loading demographics:', error);
      setError('Error loading demographics');
    } finally {
      setLoading(false);
    }
  };

  // Create new demographic
  const createDemographic = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a demographic name');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/demographics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          age_range: formData.age_range,
          characteristics: formData.characteristics.filter(c => c.trim() !== ''),
          is_active: formData.is_active
        })
      });

      const result = await response.json();
      
      if (result.success) {
        await loadDemographics();
        resetForm();
        setIsCreating(false);
        alert('Demographic created successfully!');
      } else {
        setError(result.error || 'Failed to create demographic');
        alert('Error creating demographic: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating demographic:', error);
      setError('Error creating demographic');
      alert('Error creating demographic');
    } finally {
      setLoading(false);
    }
  };

  // Update demographic
  const updateDemographic = async () => {
    if (!selectedDemographic || !formData.name.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/demographics', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedDemographic.id,
          name: formData.name,
          description: formData.description,
          age_range: formData.age_range,
          characteristics: formData.characteristics.filter(c => c.trim() !== ''),
          is_active: formData.is_active
        })
      });

      const result = await response.json();
      
      if (result.success) {
        await loadDemographics();
        setIsEditing(false);
        setSelectedDemographic(null);
        resetForm();
        alert('Demographic updated successfully!');
      } else {
        setError(result.error || 'Failed to update demographic');
        alert('Error updating demographic: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating demographic:', error);
      setError('Error updating demographic');
      alert('Error updating demographic');
    } finally {
      setLoading(false);
    }
  };

  // Delete demographic
  const deleteDemographic = async (id: string) => {
    if (!confirm('Are you sure you want to delete this demographic?')) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/demographics?id=${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        await loadDemographics();
        if (selectedDemographic?.id === id) {
          setSelectedDemographic(null);
          resetForm();
        }
        alert('Demographic deleted successfully!');
      } else {
        setError(result.error || 'Failed to delete demographic');
        alert('Error deleting demographic: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting demographic:', error);
      setError('Error deleting demographic');
      alert('Error deleting demographic');
    } finally {
      setLoading(false);
    }
  };

  // Select demographic for editing
  const selectDemographic = (demographic: Demographic) => {
    setSelectedDemographic(demographic);
    setFormData({
      name: demographic.name,
      description: demographic.description,
      age_range: demographic.age_range,
      characteristics: demographic.characteristics.length > 0 ? demographic.characteristics : [''],
      is_active: demographic.is_active
    });
    setIsEditing(true);
    setIsCreating(false);
  };

  // Start creating new demographic
  const startCreating = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedDemographic(null);
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      age_range: '',
      characteristics: [''],
      is_active: true
    });
  };

  // Handle characteristic changes
  const updateCharacteristic = (index: number, value: string) => {
    const newCharacteristics = [...formData.characteristics];
    newCharacteristics[index] = value;
    setFormData({ ...formData, characteristics: newCharacteristics });
  };

  const addCharacteristic = () => {
    setFormData({ ...formData, characteristics: [...formData.characteristics, ''] });
  };

  const removeCharacteristic = (index: number) => {
    if (formData.characteristics.length > 1) {
      const newCharacteristics = formData.characteristics.filter((_, i) => i !== index);
      setFormData({ ...formData, characteristics: newCharacteristics });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Demographics Admin</h1>
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
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">
              ← Back to Admin
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Demographics Management</h1>
          </div>
          <div className="flex items-center gap-4">
            {error && (
              <div className="text-red-600 text-sm">Error: {error}</div>
            )}
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demographics List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Demographics</h2>
                <p className="text-sm text-gray-600 mt-1">Manage target demographic profiles</p>
              </div>
              <button
                onClick={startCreating}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                + Add New
              </button>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <div className="text-gray-600">Loading demographics...</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {demographics.map((demographic) => (
                    <div
                      key={demographic.id}
                      className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                        selectedDemographic?.id === demographic.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => selectDemographic(demographic)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{demographic.name}</div>
                          <div className="text-sm text-gray-600 mt-1">{demographic.age_range}</div>
                          <div className="text-sm text-gray-500 mt-1">{demographic.description}</div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {demographic.characteristics.slice(0, 3).map((char, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                {char}
                              </span>
                            ))}
                            {demographic.characteristics.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                +{demographic.characteristics.length - 3} more
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="text-xs text-gray-500">
                              {demographic.is_active ? '✅ Active' : '⏸️ Inactive'}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteDemographic(demographic.id);
                              }}
                              className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {demographics.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      No demographics found. Click "Add New" to create your first demographic profile.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Demographic Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {isCreating ? 'Create New Demographic' : 
                 isEditing ? `Edit: ${selectedDemographic?.name}` : 
                 'Select a demographic to edit'}
              </h2>
            </div>
            <div className="p-6">
              {(isCreating || isEditing) ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Gen Z, Millennials, Baby Boomers"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                    <input
                      type="text"
                      value={formData.age_range}
                      onChange={(e) => setFormData({ ...formData, age_range: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 18-26, 27-42, 43-58"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief description of this demographic group"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Characteristics</label>
                    <div className="space-y-2">
                      {formData.characteristics.map((characteristic, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={characteristic}
                            onChange={(e) => updateCharacteristic(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Digital native, Values authenticity"
                          />
                          {formData.characteristics.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeCharacteristic(index)}
                              className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addCharacteristic}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        + Add Characteristic
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                      Active (available for use in ad critiques)
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={isCreating ? createDemographic : updateDemographic}
                      disabled={loading || !formData.name.trim()}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Saving...' : isCreating ? 'Create Demographic' : 'Update Demographic'}
                    </button>
                    <button
                      onClick={() => {
                        setIsCreating(false);
                        setIsEditing(false);
                        setSelectedDemographic(null);
                        resetForm();
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  Select a demographic from the list to edit or create a new one
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}