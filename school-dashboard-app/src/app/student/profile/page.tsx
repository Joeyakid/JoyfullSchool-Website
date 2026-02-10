'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, User, Mail, Hash, Book, Calendar, Smartphone, LogOut, Clock } from 'lucide-react';

export default function StudentProfile() {
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '' });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const { id } = JSON.parse(storedUser);
            fetch(`/api/student/profile?userId=${id}`)
                .then(res => res.json())
                .then(data => {
                    setProfile(data);
                    setFormData({ firstName: data.firstName, lastName: data.lastName, phone: data.phone });
                });
        }
    }, []);

    const handleSave = async () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;
        const { id } = JSON.parse(storedUser);

        await fetch('/api/student/profile', {
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
                    await fetch('/api/student/profile', {
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
        // Clear mock auth
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        // Redirect
        router.push('/login/student');
    };

    if (!profile) return <div className="p-8">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Banner */}
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

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
                            <label className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-sm">
                                <Camera className="w-4 h-4" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        </div>

                        <div className="flex gap-3">
                            {isEditing ? (
                                <>
                                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                                    <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Save Changes</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 flex items-center gap-2">
                                        <LogOut className="w-4 h-4" /> Logout
                                    </button>
                                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">Edit Profile</button>
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

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                                        <Mail className="w-3 h-3" /> Email Address
                                    </label>
                                    <p className="text-gray-900 font-medium">{profile.email}</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                                        <Smartphone className="w-3 h-3" /> Phone Number
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full p-2 border rounded-md text-sm"
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-medium">{profile.phone}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Academic Information</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                                        <Hash className="w-3 h-3" /> Matric Number
                                    </label>
                                    <p className="text-gray-900 font-medium bg-gray-50 inline-block px-3 py-1 rounded text-sm border border-gray-200 font-mono tracking-wider">
                                        {profile.matricNo}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                                        <Book className="w-3 h-3" /> Program
                                    </label>
                                    <p className="text-gray-900 font-medium">{profile.program}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Level</label>
                                        <p className="text-gray-900 font-medium">{profile.level}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> Semester
                                        </label>
                                        <p className="text-gray-900 font-medium">{profile.semester}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Academic Session History */}
            {profile.academicHistory && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" /> Academic Session History
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">Session</th>
                                    <th className="px-4 py-3">Semester</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 rounded-r-lg">GPA</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {profile.academicHistory.map((item: any, index: number) => (
                                    <tr key={index} className="hover:bg-gray-50/50">
                                        <td className="px-4 py-3 font-medium text-gray-900">{item.session}</td>
                                        <td className="px-4 py-3 text-gray-600">{item.semester} Semester</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'Current'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-gray-700">{item.gpa}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
