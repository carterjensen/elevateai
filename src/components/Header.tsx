'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div className="absolute inset-0 bg-gradient-primary rounded-xl opacity-0 group-hover:opacity-20 blur-lg transition-opacity"></div>
            </div>
            <span className="text-2xl font-bold text-gradient">ElevateAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-slate-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/ad-critic" 
              className="text-slate-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
            >
              Ad Critic
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/brandchat" 
              className="text-slate-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
            >
              BrandChat
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <div className="relative group">
              <button className="text-slate-700 hover:text-blue-600 font-medium transition-colors duration-200 flex items-center space-x-1">
                <span>Admin</span>
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown */}
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <Link 
                    href="/admin" 
                    className="block px-4 py-2 text-slate-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/admin/demographics" 
                    className="block px-4 py-2 text-slate-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  >
                    Demographics
                  </Link>
                  <Link 
                    href="/admin/brands" 
                    className="block px-4 py-2 text-slate-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  >
                    Brands
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/ad-critic" 
              className="bg-gradient-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              Try Ad Critic
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg 
              className={`w-6 h-6 transition-transform ${isMobileMenuOpen ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-4 space-y-2">
            <Link 
              href="/" 
              className="block px-4 py-3 text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/ad-critic" 
              className="block px-4 py-3 text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Ad Critic
            </Link>
            <Link 
              href="/brandchat" 
              className="block px-4 py-3 text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              BrandChat
            </Link>
            <Link 
              href="/admin" 
              className="block px-4 py-3 text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Admin
            </Link>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <Link 
                href="/ad-critic" 
                className="block w-full bg-gradient-primary text-white text-center py-3 px-4 rounded-lg font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Try Ad Critic
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}