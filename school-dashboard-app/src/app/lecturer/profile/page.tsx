'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, User, Mail, Smartphone, Building2, LogOut } from 'lucide-react';

export default function LecturerProfile() {
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', department: '', phone: '' });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const { id } = JSON.parse(storedUser);
            fetch(`/api/lecturer/profile?userId=${id}`)
                .then(res => res.json())
                .then(data => {
                    setProfile(data);
                    setFormData({ firstName: data.firstName, lastName: data.lastName, department: data.department || '', phone: data.phone || '' });
                });
        }
    }, []);

    const handleSave = async () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;
        const { id } = JSON.parse(storedUser);

        await fetch('/api/lecturer/profile', {
            method: 'PUT',
            body: JSON.stringify({ userId: id, ...formData })
        });
        setProfile({ ...profile, ...formData });
        setIsEditing(false);
        window.location.reload();
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result as string;
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const { id } = JSON.parse(storedUser);
                    await fetch('/api/lecturer/profile', {
                        method: 'PUT',
                        body: JSON.stringify({ userId: id, avatarUrl: base64 })
                    });
                    setProfile({ ...profile, avatarUrl: base64 });
                    window.location.reload();
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        router.push('/login/lecturer');
    };

    if (!profile) return <div className="p-8">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Banner */}
                <div className="h-32 bg-gradient-to-r from-purple-700 to-indigo-800"></div>

                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="relative group">
                            <div className="h-24 w-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center bg-gray-100">
                                {profile.avatarUrl ? (
                                    <img src={profile.avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    <User className="h-10 w-10 text-gray-400" />
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 p-1.5 bg-purple-600 text-white rounded-full cursor-pointer hover:bg-purple-700 transition-colors shadow-sm">
                                <Camera className="w-4 h-4" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        </div>

                        <div className="flex gap-3">
                            {isEditing ? (
                                <>
                                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                                    <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700">Save Changes</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 flex items-center gap-2">
                                        <LogOut className="w-4 h-4" /> Logout
                                    </button>
                                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100">Edit Profile</button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Personal Information</h3>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">First Name</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                className="w-full p-2 border rounded-md text-sm"
                                            />
                                        ) : (
                                            <p className="text-gray-900 font-medium">{profile.firstName}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Last Name</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                className="w-full p-2 border rounded-md text-sm"
                                            />
                                        ) : (
                                            <p className="text-gray-900 font-medium">{profile.lastName}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Professional Details</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                                        <Building2 className="w-3 h-3" /> Department
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            className="w-full p-2 border rounded-md text-sm"
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-medium">{profile.department || 'Not Set'}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                                        <Smartphone className="w-3 h-3" /> Phone
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full p-2 border rounded-md text-sm"
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-medium">{profile.phone || 'Not Set'}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
