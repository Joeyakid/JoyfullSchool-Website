'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogOut, Banknote } from 'lucide-react';

export default function StaffProfile() {
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const { id } = JSON.parse(storedUser);
            fetch(`/api/staff/profile?userId=${id}`)
                .then(res => res.json())
                .then(data => setProfile(data));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        router.push('/login/staff');
    };

    if (!profile) return <div className="p-8">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-green-600 to-teal-700"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="h-24 w-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center bg-gray-100">
                            {profile.avatarUrl ? (
                                <img src={profile.avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                <User className="h-10 w-10 text-gray-400" />
                            )}
                        </div>
                        <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 flex items-center gap-2">
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h1>
                    <p className="text-gray-500 font-medium">{profile.department} Staff</p>
                    <p className="text-sm text-gray-400 mt-1">{profile.phone}</p>

                    <div className="mt-8 border-t border-gray-100 pt-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Banknote className="w-5 h-5 text-green-600" /> Payroll Information
                        </h3>
                        {profile.salary ? (
                            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Basic monthly</p>
                                        <p className="text-lg font-bold text-gray-900">₦{profile.salary.basic.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Net Pay</p>
                                        <p className="text-lg font-bold text-green-700">₦{profile.salary.net.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Last Status</p>
                                        <span className="px-2 py-1 text-xs font-bold bg-green-200 text-green-800 rounded-full">{profile.salary.status}</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Payment Date</p>
                                        <p className="text-sm font-medium text-gray-900">{profile.salary.paymentDate}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">Payroll information unavailable.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
