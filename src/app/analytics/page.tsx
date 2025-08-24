'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface UsageData {
  date: string;
  brandchat: number;
  adcritic: number;
  legallens: number;
  total: number;
}

interface ModuleStats {
  name: string;
  usage: number;
  percentage: number;
  color: string;
  icon: string;
}

export default function AnalyticsDashboard() {
  const [activeView, setActiveView] = useState<'hourly' | 'daily' | 'weekly' | 'monthly'>('daily');
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'platforms' | 'insights' | 'export'>('analytics');
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [moduleStats, setModuleStats] = useState<ModuleStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, [activeView]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAnalyticsData = async () => {
    setLoading(true);
    
    // Simulate loading analytics data
    setTimeout(() => {
      const mockData = generateMockData(activeView);
      setUsageData(mockData);
      setModuleStats(generateModuleStats());
      setLoading(false);
    }, 1000);
  };

  const generateMockData = (view: string): UsageData[] => {
    const now = new Date();
    const data: UsageData[] = [];
    const periods = view === 'hourly' ? 24 : view === 'daily' ? 30 : view === 'weekly' ? 12 : 12;

    for (let i = periods - 1; i >= 0; i--) {
      const date = new Date(now);
      if (view === 'hourly') {
        date.setHours(date.getHours() - i);
      } else if (view === 'daily') {
        date.setDate(date.getDate() - i);
      } else if (view === 'weekly') {
        date.setDate(date.getDate() - (i * 7));
      } else {
        date.setMonth(date.getMonth() - i);
      }

      const brandchat = Math.floor(Math.random() * 50) + 10;
      const adcritic = Math.floor(Math.random() * 30) + 5;
      const legallens = Math.floor(Math.random() * 20) + 3;

      data.push({
        date: formatDate(date, view),
        brandchat,
        adcritic,
        legallens,
        total: brandchat + adcritic + legallens
      });
    }

    return data;
  };

  const generateModuleStats = (): ModuleStats[] => {
    const brandchatUsage = Math.floor(Math.random() * 1000) + 500;
    const adcriticUsage = Math.floor(Math.random() * 300) + 150;
    const legallensUsage = Math.floor(Math.random() * 200) + 100;
    const total = brandchatUsage + adcriticUsage + legallensUsage;

    return [
      {
        name: 'BrandChat',
        usage: brandchatUsage,
        percentage: Math.round((brandchatUsage / total) * 100),
        color: 'bg-blue-500',
        icon: '💬'
      },
      {
        name: 'Ad Critic',
        usage: adcriticUsage,
        percentage: Math.round((adcriticUsage / total) * 100),
        color: 'bg-green-500',
        icon: '🎯'
      },
      {
        name: 'LegalLens',
        usage: legallensUsage,
        percentage: Math.round((legallensUsage / total) * 100),
        color: 'bg-purple-500',
        icon: '⚖️'
      }
    ];
  };

  const formatDate = (date: Date, view: string): string => {
    if (view === 'hourly') {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (view === 'daily') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (view === 'weekly') {
      return `Week of ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
  };

  const maxUsage = Math.max(...usageData.map(d => d.total));
  const getBarHeight = (value: number) => (value / maxUsage) * 200;

  const exportData = () => {
    const csvContent = [
      'Date,BrandChat,AdCritic,LegalLens,Total',
      ...usageData.map(d => `${d.date},${d.brandchat},${d.adcritic},${d.legallens},${d.total}`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elevateai-analytics-${activeView}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Analytics Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-green-600 text-lg">📊</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Analytics</h1>
                <p className="text-gray-600">Usage Intelligence Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={loadAnalyticsData}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <span className="text-sm">🔄</span>
                Refresh
              </button>
              <button
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <span className="text-sm">📊</span>
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'analytics', label: 'Analytics' },
              { key: 'platforms', label: 'Platforms' },
              { key: 'insights', label: 'Insights' },
              { key: 'export', label: 'Export' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'overview' | 'analytics' | 'platforms' | 'insights' | 'export')}
                className={`px-4 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Comparative Usage Analysis */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Comparative Usage Analysis</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">View:</span>
                    {['hourly', 'daily', 'weekly', 'monthly'].map(view => (
                      <button
                        key={view}
                        onClick={() => setActiveView(view as 'hourly' | 'daily' | 'weekly' | 'monthly')}
                        className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                          activeView === view
                            ? 'bg-green-100 text-green-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        {view.charAt(0).toUpperCase() + view.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="ml-3 text-gray-600">Loading analytics...</span>
                  </div>
                ) : (
                  <div className="h-64 flex items-end justify-between gap-2 mb-4">
                    {usageData.map((data, index) => (
                      <div key={index} className="flex flex-col items-center flex-1 min-w-0">
                        <div className="w-full flex flex-col items-end justify-end gap-1" style={{ height: '200px' }}>
                          {/* LegalLens bar */}
                          <div
                            className="w-full bg-purple-500 rounded-t-sm relative group"
                            style={{ height: `${getBarHeight(data.legallens)}px` }}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              LegalLens: {data.legallens}
                            </div>
                          </div>
                          {/* Ad Critic bar */}
                          <div
                            className="w-full bg-green-500 relative group"
                            style={{ height: `${getBarHeight(data.adcritic)}px` }}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              Ad Critic: {data.adcritic}
                            </div>
                          </div>
                          {/* BrandChat bar */}
                          <div
                            className="w-full bg-blue-500 relative group"
                            style={{ height: `${getBarHeight(data.brandchat)}px` }}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              BrandChat: {data.brandchat}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-600 mt-2 text-center truncate w-full">
                          {data.date}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-sm text-gray-600">BrandChat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-sm text-gray-600">Ad Critic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <span className="text-sm text-gray-600">LegalLens</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Patterns */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Usage Patterns</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {moduleStats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                        <span className="text-2xl">{stat.icon}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{stat.name}</h3>
                      <div className="mb-2">
                        <div className="text-2xl font-bold text-gray-900">{stat.usage.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">total uses</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${stat.color}`}
                          style={{ width: `${stat.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{stat.percentage}% of total</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Overview Coming Soon</h3>
            <p className="text-gray-600">Comprehensive platform overview is in development.</p>
          </div>
        )}

        {activeTab === 'platforms' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🔗</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Platform Integration</h3>
            <p className="text-gray-600">Cross-platform analytics coming soon.</p>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Insights</h3>
            <p className="text-gray-600">Intelligent usage insights and recommendations coming soon.</p>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl text-blue-600">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Data</h3>
            <p className="text-gray-600 mb-6">Export your analytics data in various formats.</p>
            <div className="space-y-4">
              <button
                onClick={exportData}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Export as CSV
              </button>
              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-lg cursor-not-allowed"
              >
                Export as PDF (Coming Soon)
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}