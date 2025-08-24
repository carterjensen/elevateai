import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b">
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
          <nav className="flex items-center gap-6">
            <Link href="/brandchat" className="text-gray-600 hover:text-gray-900 transition-colors">
              BrandChat
            </Link>
            <Link href="/legallens" className="text-gray-600 hover:text-gray-900 transition-colors">
              LegalLens
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors">
              Admin
            </Link>
            <Link href="/superadmin" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold">
              Super Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}