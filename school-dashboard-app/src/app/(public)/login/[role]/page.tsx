'use client';

import { Lock, User, ArrowRight } from "lucide-react";
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useState, FormEvent, useEffect } from 'react';

// Helper to normalize role names for display
const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1).replace('-', ' ');
}

export default function RoleLoginPage() {
    const router = useRouter();
    const params = useParams();
    const role = params.role as string;

    const normalizedRole = role.toLowerCase();
    const displayRole = formatRole(normalizedRole);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Dynamic Theme Colors based on role
    const getTheme = (r: string) => {
        switch (r) {
            case 'student': return { color: 'text-blue-600', bg: 'bg-blue-600', ring: 'focus:ring-blue-600' };
            case 'lecturer': return { color: 'text-purple-600', bg: 'bg-purple-600', ring: 'focus:ring-purple-600' };
            case 'school-admin': return { color: 'text-orange-600', bg: 'bg-orange-600', ring: 'focus:ring-orange-600' };
            case 'staff': return { color: 'text-green-600', bg: 'bg-green-600', ring: 'focus:ring-green-600' };
            default: return { color: 'text-gray-900', bg: 'bg-gray-900', ring: 'focus:ring-gray-900' };
        }
    }

    const theme = getTheme(normalizedRole);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role: normalizedRole }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Save to localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect to dashboard
            if (data.role === 'student') router.push('/student/dashboard');
            else if (data.role === 'lecturer') router.push('/lecturer/dashboard');
            else if (data.role === 'staff') router.push('/staff/dashboard');
            else if (data.role === 'school-admin') router.push('/school-admin/dashboard');
            else router.push('/');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gray-100 ${theme.color}`}>
                        <Lock className="w-8 h-8" />
                    </div>
                    <h2 className={`mt-6 text-3xl font-extrabold ${theme.color}`}>
                        {displayRole} Portal
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your credentials to access the {displayRole} dashboard
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-md text-center">
                            {error}
                        </div>
                    )}

                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-transparent focus:z-10 sm:text-sm transition-all ${theme.ring} focus:ring-2`}
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <Link href={`/login/${role}/forgot-password`} className={`text-sm font-medium hover:underline ${theme.color}`}>
                                    Forgot Password?
                                </Link>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-transparent focus:z-10 sm:text-sm transition-all ${theme.ring} focus:ring-2`}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg hover:opacity-90 ${theme.bg} ${theme.ring} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <ArrowRight className="h-5 w-5 text-white/80 group-hover:text-white" />
                            </span>
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>

                    <div className="text-center mt-4 space-y-2">
                        <Link href="/login" className="block font-medium text-gray-500 hover:text-gray-900 text-sm">
                            Switch Portal
                        </Link>
                        <Link href="/" className="block font-medium text-gray-400 hover:text-gray-600 text-xs">
                            Back to Home
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
