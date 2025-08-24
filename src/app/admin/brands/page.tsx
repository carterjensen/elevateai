'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Brand {
  id: string;
  name: string;
  description: string;
  industry: string;
  tone: string;
  logo: string;
  brand_values: string[];
  target_demographics: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Demographic {
  id: string;
  name: string;
}

export default function BrandsAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [demographics, setDemographics] = useState<Demographic[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    tone: '',
    logo: '',
    brand_values: [''],
    target_demographics: [] as string[],
    is_active: true
  });

  // Simple password auth for admin access
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'elevateai2024') {
      setIsAuthenticated(true);
      loadBrands();
      loadDemographics();
    } else {
      alert('Incorrect password');
    }
  };

  // Load all brands from Supabase
  const loadBrands = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      console.error('Error loading brands:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load demographics for targeting
  const loadDemographics = async () => {
    try {
      const { data, error } = await supabase
        .from('demographics')
        .select('id, name')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      setDemographics(data || []);
    } catch (error) {
      console.error('Error loading demographics:', error);
    }
  };

  // Create new brand
  const createBrand = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a brand name');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('brands')
        .insert({
          name: formData.name,
          description: formData.description,
          industry: formData.industry,
          tone: formData.tone,
          logo: formData.logo,
          brand_values: formData.brand_values.filter(v => v.trim() !== ''),
          target_demographics: formData.target_demographics,
          is_active: formData.is_active,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      await loadBrands();
      resetForm();
      setIsCreating(false);
      alert('Brand created successfully!');
    } catch (error) {
      console.error('Error creating brand:', error);
      alert('Error creating brand');
    } finally {
      setLoading(false);
    }
  };

  // Update brand
  const updateBrand = async () => {
    if (!selectedBrand || !formData.name.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('brands')
        .update({
          name: formData.name,
          description: formData.description,
          industry: formData.industry,
          tone: formData.tone,
          logo: formData.logo,
          brand_values: formData.brand_values.filter(v => v.trim() !== ''),
          target_demographics: formData.target_demographics,
          is_active: formData.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedBrand.id);
      
      if (error) throw error;
      
      await loadBrands();
      setIsEditing(false);
      setSelectedBrand(null);
      resetForm();
      alert('Brand updated successfully!');
    } catch (error) {
      console.error('Error updating brand:', error);
      alert('Error updating brand');
    } finally {
      setLoading(false);
    }
  };

  // Delete brand
  const deleteBrand = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await loadBrands();
      if (selectedBrand?.id === id) {
        setSelectedBrand(null);
        resetForm();
      }
      alert('Brand deleted successfully!');
    } catch (error) {
      console.error('Error deleting brand:', error);
      alert('Error deleting brand');
    } finally {
      setLoading(false);
    }
  };

  // Select brand for editing
  const selectBrand = (brand: Brand) => {
    setSelectedBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description,
      industry: brand.industry,
      tone: brand.tone,
      logo: brand.logo,
      brand_values: brand.brand_values.length > 0 ? brand.brand_values : [''],
      target_demographics: brand.target_demographics || [],
      is_active: brand.is_active
    });
    setIsEditing(true);
    setIsCreating(false);
  };

  // Start creating new brand
  const startCreating = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedBrand(null);
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      industry: '',
      tone: '',
      logo: '',
      brand_values: [''],
      target_demographics: [],
      is_active: true
    });
  };

  // Handle brand value changes
  const updateBrandValue = (index: number, value: string) => {
    const newValues = [...formData.brand_values];
    newValues[index] = value;
    setFormData({ ...formData, brand_values: newValues });
  };

  const addBrandValue = () => {
    setFormData({ ...formData, brand_values: [...formData.brand_values, ''] });
  };

  const removeBrandValue = (index: number) => {
    if (formData.brand_values.length > 1) {
      const newValues = formData.brand_values.filter((_, i) => i !== index);
      setFormData({ ...formData, brand_values: newValues });
    }
  };

  // Handle demographic selection
  const toggleDemographic = (demographicId: string) => {
    const isSelected = formData.target_demographics.includes(demographicId);
    if (isSelected) {
      setFormData({
        ...formData,
        target_demographics: formData.target_demographics.filter(id => id !== demographicId)
      });
    } else {
      setFormData({
        ...formData,
        target_demographics: [...formData.target_demographics, demographicId]
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Brands Admin</h1>
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
            <h1 className="text-2xl font-bold text-gray-900">Brands Management</h1>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Brands List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Brands</h2>
              <button
                onClick={startCreating}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                + Add New
              </button>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <div className="space-y-3">
                  {brands.map((brand) => (
                    <div
                      key={brand.id}
                      className={`p-4 rounded-lg border transition-colors ${
                        selectedBrand?.id === brand.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{brand.logo || '🏢'}</span>
                            <div className="font-medium text-gray-900">{brand.name}</div>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">{brand.industry}</div>
                          <div className="text-sm text-gray-500 mt-1">{brand.description}</div>
                          <div className="text-sm text-gray-600 mt-1 italic">{brand.tone}</div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {brand.brand_values.slice(0, 3).map((value, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                {value}
                              </span>
                            ))}
                            {brand.brand_values.length > 3 && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                +{brand.brand_values.length - 3} more
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            {brand.is_active ? '✅ Active' : '⏸️ Inactive'}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => selectBrand(brand)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteBrand(brand.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {brands.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No brands found. Create your first brand to get started.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Brand Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {isCreating ? 'Create New Brand' : 
                 isEditing ? `Edit: ${selectedBrand?.name}` : 
                 'Select a brand to edit'}
              </h2>
            </div>
            <div className="p-6">
              {(isCreating || isEditing) ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Apple, Nike, Tesla"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Logo (Emoji)</label>
                    <input
                      type="text"
                      value={formData.logo}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="🍎"
                      maxLength={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Technology, Fashion, Automotive"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief description of the brand"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand Tone</label>
                    <input
                      type="text"
                      value={formData.tone}
                      onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Sleek, innovative, premium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand Values</label>
                    <div className="space-y-2">
                      {formData.brand_values.map((value, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => updateBrandValue(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Innovation, Quality, Sustainability"
                          />
                          {formData.brand_values.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeBrandValue(index)}
                              className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addBrandValue}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        + Add Value
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Demographics</label>
                    <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                      {demographics.map((demographic) => (
                        <label key={demographic.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.target_demographics.includes(demographic.id)}
                            onChange={() => toggleDemographic(demographic.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-900">{demographic.name}</span>
                        </label>
                      ))}
                      {demographics.length === 0 && (
                        <div className="text-sm text-gray-500">
                          No demographics available. <Link href="/admin/demographics" className="text-blue-600">Create some first</Link>.
                        </div>
                      )}
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
                      onClick={isCreating ? createBrand : updateBrand}
                      disabled={loading || !formData.name.trim()}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Saving...' : isCreating ? 'Create Brand' : 'Update Brand'}
                    </button>
                    <button
                      onClick={() => {
                        setIsCreating(false);
                        setIsEditing(false);
                        setSelectedBrand(null);
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
                  Select a brand from the list to edit or create a new one
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}