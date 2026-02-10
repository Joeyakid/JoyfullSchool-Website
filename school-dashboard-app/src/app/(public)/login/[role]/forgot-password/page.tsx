'use client';

import Link from 'next/link';

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Reset Password</h2>
                <p className="text-gray-600 mb-6">
                    Password reset functionality is currently under development.
                    Please contact your School Administrator.
                </p>
                <Link href="/login" className="text-primary hover:underline">
                    Back to Login
                </Link>
            </div>
        </div>
    );
}
