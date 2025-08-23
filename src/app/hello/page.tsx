export default function HelloWorld() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          Hello World! 👋
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Welcome to your Next.js app with Supabase integration
        </p>
        <div className="space-x-4">
          <a 
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </a>
          <a 
            href="/test-supabase"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Test Supabase
          </a>
        </div>
      </div>
    </div>
  );
}