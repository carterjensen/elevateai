import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">ElevateAI</h1>
            </div>
            <nav className="flex items-center gap-6">
              <Link href="/ad-critic" className="text-gray-600 hover:text-gray-900">
                Ad Critic
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Elevate Your Marketing with AI
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Analyze advertisements with AI-powered insights. Get demographic-specific feedback 
            and improve your campaigns with data-driven recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/ad-critic"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Ad Critic
            </Link>
            <Link 
              href="/admin"
              className="bg-white text-gray-700 px-8 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Admin Panel
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg border">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ad Analysis</h3>
            <p className="text-gray-600">
              Upload images and get instant AI-powered analysis with demographic insights 
              and improvement suggestions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Demographics</h3>
            <p className="text-gray-600">
              Manage target demographic groups and get analysis tailored to specific 
              audience segments.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Brand Management</h3>
            <p className="text-gray-600">
              Define brand profiles and characteristics to get analysis aligned with 
              your brand identity.
            </p>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t mt-24">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 ElevateAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}