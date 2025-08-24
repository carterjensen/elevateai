export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            ⚡ AI-Powered Brand & Marketing Solutions
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
            ElevateAI Platform
          </h1>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Revolutionize your brand and marketing workflow with our comprehensive suite of AI-powered tools designed to enhance creativity, streamline processes, and deliver exceptional results for your campaigns.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* AdCritic */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-medium">Active</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AdCritic</h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Get instant, demographic-tailored critiques on your ads to cut revision cycles by 70%, boost campaign performance, and wow clients with data-backed creatives that convert—saving...
              </p>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm font-semibold text-orange-800">Early Beta</span>
                </div>
                <p className="text-sm text-orange-700">
                  This is an early beta version. Use sparingly and always provide feedback. Be flexible as we continue to improve.
                </p>
              </div>
              
              <div className="space-y-2 mb-8">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">Demographic Targeting</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">Performance Boost</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">Data-Backed Insights</span>
                </div>
              </div>
              
              <a
                href="/ad-critic"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-center inline-block"
              >
                Launch AdCritic
              </a>
            </div>
          </div>

          {/* BrandChat */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                  <div className="w-6 h-6 bg-green-600 rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-medium">Active</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">BrandChat</h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Simulate real conversations with your target audience personas, infused with your brand&apos;s voice, to test messaging in minutes—reducing client churn by ensuring personalized content...
              </p>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm font-semibold text-orange-800">Early Beta</span>
                </div>
                <p className="text-sm text-orange-700">
                  This is an early beta version. Use sparingly and always provide feedback. Be flexible as we continue to improve.
                </p>
              </div>
              
              <div className="space-y-2 mb-8">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">Persona Simulation</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">Brand Voice Testing</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">Message Resonance</span>
                </div>
              </div>
              
              <a
                href="/brandchat"
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 text-center inline-block"
              >
                Launch BrandChat
              </a>
            </div>
          </div>

          {/* LegalLens */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <div className="w-6 h-6 bg-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-orange-600 font-medium">Early Preview</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">LegalLens</h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Pre-scan ads against client-specific legal requirements to avoid costly revisions and delays, scoring compliance in seconds—streamlining approvals, minimizing fines or...
              </p>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm font-semibold text-orange-800">Early Beta</span>
                </div>
                <p className="text-sm text-orange-700">
                  This is an early beta version. Use sparingly and always provide feedback. Be flexible as we continue to improve.
                </p>
              </div>
              
              <div className="space-y-2 mb-8">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">Compliance Scoring</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">Risk Prevention</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">Legal Protection</span>
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200">
                Sign in to access
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
