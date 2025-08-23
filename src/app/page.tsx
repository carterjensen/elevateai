export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <main className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Hello World! 🌍
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Welcome to your Next.js application with Supabase integration. 
            This is your starting point for building something amazing!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a 
              href="/hello"
              className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
            >
              View Hello Page
            </a>
            <a 
              href="/test-supabase"
              className="bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
            >
              Test Supabase
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">🚀 Next.js 15</h3>
              <p className="text-gray-600">Latest Next.js with App Router and Turbopack for lightning-fast development</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">🗄️ Supabase</h3>
              <p className="text-gray-600">Backend-as-a-Service with real-time database and authentication</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">🎨 Tailwind</h3>
              <p className="text-gray-600">Modern CSS framework for beautiful, responsive designs</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
