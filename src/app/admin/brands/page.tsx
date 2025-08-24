'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Brand } from '@/lib/sampleData';

export default function BrandsAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tone: '',
    logo: '',
    is_active: true
  });

  // Simple password auth for admin access
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'elevateai2024') {
      setIsAuthenticated(true);
      await loadBrands();
    } else {
      alert('Invalid password');
    }
  };

  // Load brands from API
  const loadBrands = async () => {
    try {
      const response = await fetch('/api/admin/brands');
      const result = await response.json();
      
      if (result.success && result.data) {
        setBrands(result.data);
      }
    } catch (error) {
      console.error('Failed to load brands:', error);
    }
  };

  // Create new brand
  const handleCreate = async () => {
    if (!formData.name.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/admin/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        await loadBrands();
        setIsCreating(false);
        resetForm();
      } else {
        throw new Error(result.error || 'Failed to create brand');
      }
    } catch (error) {
      console.error('Create brand error:', error);
      alert('Failed to create brand');
    }
    setLoading(false);
  };

  // Update existing brand
  const handleUpdate = async () => {
    if (!selectedBrand || !formData.name.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/admin/brands', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: selectedBrand.id })
      });

      const result = await response.json();
      
      if (result.success) {
        await loadBrands();
        setSelectedBrand(null);
        resetForm();
      } else {
        throw new Error(result.error || 'Failed to update brand');
      }
    } catch (error) {
      console.error('Update brand error:', error);
      alert('Failed to update brand');
    }
    setLoading(false);
  };

  // Delete brand
  const handleDelete = async (brandId: string) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/brands?id=${brandId}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        await loadBrands();
      } else {
        throw new Error(result.error || 'Failed to delete brand');
      }
    } catch (error) {
      console.error('Delete brand error:', error);
      alert('Failed to delete brand');
    }
    setLoading(false);
  };

  // Edit brand
  const editBrand = (brand: Brand) => {
    setSelectedBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description,
      tone: brand.tone,
      logo: brand.logo,
      is_active: brand.is_active
    });
    setIsCreating(false);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      tone: '',
      logo: '',
      is_active: true
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Access</h1>
            <p className="text-gray-600 mt-2">Enter password to manage brands</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Admin Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Access Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Brand Management</h1>
            <p className="text-gray-600 mt-2">Manage brand profiles for ElevateAI</p>
          </div>
          <Link
            href="/admin"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Back to Admin
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Brands List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Brands ({brands.length})</h2>
                <button
                  onClick={() => {
                    setIsCreating(true);
                    setSelectedBrand(null);
                    resetForm();
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + Add New
                </button>
              </div>

              {brands.length > 0 ? (
                <div className="space-y-4">
                  {brands.map((brand) => (
                    <div key={brand.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-gray-900">{brand.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              brand.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {brand.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">{brand.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>Tone: {brand.tone}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => editBrand(brand)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(brand.id)}
                            className="text-red-600 hover:text-red-800 font-medium text-sm"
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📦</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No brands found</h3>
                  <p className="text-gray-600">Click &quot;Add New&quot; to create your first brand profile.</p>
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          {(isCreating || selectedBrand) && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {isCreating ? 'Create New Brand' : 'Edit Brand'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter brand name..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    placeholder="Enter logo URL..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter brand description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand Tone</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.tone}
                    onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                    placeholder="e.g., Professional, Casual, Innovative..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                    Active
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={isCreating ? handleCreate : handleUpdate}
                    disabled={loading || !formData.name.trim()}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (isCreating ? 'Create Brand' : 'Update Brand')}
                  </button>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setSelectedBrand(null);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}