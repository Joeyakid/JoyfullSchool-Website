'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, GraduationCap, Users, BookOpen, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const loginOptions = [
    { name: 'Student Portal', href: '/login/student', icon: <GraduationCap className="w-4 h-4 text-blue-600" /> },
    { name: 'Lecturer Portal', href: '/login/lecturer', icon: <BookOpen className="w-4 h-4 text-purple-600" /> },
    { name: 'Staff Portal', href: '/login/staff', icon: <Users className="w-4 h-4 text-green-600" /> },
  ];

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
              Joyfull Academics
            </h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {/* Login Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLoginOpen(!isLoginOpen)}
                onBlur={() => setTimeout(() => setIsLoginOpen(false), 200)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm font-medium shadow-sm active:scale-95 duration-200"
              >
                Login
                <ChevronDown className={cn("w-4 h-4 transition-transform", isLoginOpen ? "rotate-180" : "")} />
              </button>

              {isLoginOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 p-1">
                  {loginOptions.map((option) => (
                    <Link
                      key={option.name}
                      href={option.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
                    >
                      <div className="p-1.5 bg-gray-50 rounded-md border border-gray-100">
                        {option.icon}
                      </div>
                      {option.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-4 pb-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="block text-base font-medium text-gray-700 hover:text-primary px-2"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-100">
            <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Login Portals</p>
            {loginOptions.map((option) => (
              <Link
                key={option.name}
                href={option.href}
                className="flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700"
              >
                {option.icon}
                {option.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
