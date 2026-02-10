'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    BookOpen,
    Video,
    User,
    Menu,
    X,
    GraduationCap,
    LogOut,
    Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StudentNav() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState<{ firstName: string; lastName: string; avatarUrl: string | null } | null>(null);

    useEffect(() => {
        // Fetch user profile for navbar
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const { id } = JSON.parse(storedUser);
            if (id) {
                fetch(`/api/student/profile?userId=${id}`)
                    .then(res => res.json())
                    .then(data => setUser(data))
                    .catch(err => console.error("Nav profile fetch error:", err));
            }
        }
    }, []);

    const navLinks = [
        { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
        { name: 'Courses', href: '/student/courses', icon: BookOpen },
        { name: 'Classes', href: '/student/classes', icon: Video },
        { name: 'Profile', href: '/student/profile', icon: User },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                            <GraduationCap className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-xl text-gray-900 hidden sm:block">Joyfull Academy</span>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                        isActive(link.href)
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* User & Mobile Menu Toggle */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>

                        <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-200">
                            <div className="text-right hidden lg:block">
                                <p className="text-sm font-semibold text-gray-900">{user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</p>
                                <p className="text-xs text-gray-500">Student</p>
                            </div>
                            <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border border-blue-200">
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    <User className="h-5 w-5 text-blue-600" />
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-2">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors",
                                    isActive(link.href)
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {link.name}
                            </Link>
                        );
                    })}
                    <div className="pt-4 border-t border-gray-100 mt-2">
                        <div className="flex items-center gap-3 px-4 py-2">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    <User className="h-5 w-5 text-blue-600" />
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{user ? `${user.firstName} ${user.lastName}` : 'Student'}</p>
                                <Link href="/login/student" className="text-xs text-red-600 font-medium flex items-center gap-1 mt-0.5">
                                    <LogOut className="w-3 h-3" /> Logout
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
