import { useState, useEffect } from 'react';
import { UserPlus, CheckCircle, AlertCircle, Trash2, Edit2, Search } from 'lucide-react';

export default function UserManagement() {
    const [subTab, setSubTab] = useState<'student' | 'lecturer' | 'staff'>('student');
    const [viewMode, setViewMode] = useState<'list' | 'create'>('list');
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form States
    const [studentForm, setStudentForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [lecturerForm, setLecturerForm] = useState({ firstName: '', lastName: '', email: '', password: '', department: '' });
    const [staffForm, setStaffForm] = useState({ firstName: '', lastName: '', email: '', password: '', department: '' });

    // Edit State
    const [editingUser, setEditingUser] = useState<any | null>(null);

    useEffect(() => {
        if (viewMode === 'list') {
            fetchUsers();
        }
    }, [subTab, viewMode]);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`/api/school-admin/users?role=${subTab === 'lecturer' ? 'lecturer' : subTab === 'student' ? 'student' : 'staff'}`);
            if (res.ok) {
                setUsers(await res.json());
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const endpoint = subTab === 'student' ? '/api/school-admin/register-student'
            : subTab === 'lecturer' ? '/api/school-admin/register-lecturer'
                : '/api/school-admin/register-staff';

        const body = subTab === 'student' ? studentForm
            : subTab === 'lecturer' ? lecturerForm
                : staffForm;

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: `Success! ${subTab.charAt(0).toUpperCase() + subTab.slice(1)} registered.` });
                setStudentForm({ firstName: '', lastName: '', email: '', password: '' });
                setLecturerForm({ firstName: '', lastName: '', email: '', password: '', department: '' });
                setStaffForm({ firstName: '', lastName: '', email: '', password: '', department: '' });
                // Switch back to list to see new user
                setTimeout(() => setViewMode('list'), 1500);
            } else {
                throw new Error(data.message || 'Registration failed');
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to permanently terminate this user? This action cannot be undone.')) return;

        try {
            const res = await fetch(`/api/school-admin/users?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setUsers(users.filter(u => u.id !== id));
                setMessage({ type: 'success', text: 'User terminated successfully.' });
            } else {
                setMessage({ type: 'error', text: 'Failed to delete user.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Error deleting user.' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex bg-white rounded-lg p-1 border border-gray-200">
                    {(['student', 'lecturer', 'staff'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => { setSubTab(tab); setViewMode('list'); setMessage(null); }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${subTab === tab ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}s
                        </button>
                    ))}
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg border ${viewMode === 'list' ? 'bg-white border-gray-300 shadow-sm' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        View List
                    </button>
                    <button
                        onClick={() => setViewMode('create')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg border flex items-center gap-2 ${viewMode === 'create' ? 'bg-orange-600 text-white border-orange-600 shadow-sm' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    >
                        <UserPlus className="w-4 h-4" />
                        Create New
                    </button>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-lg flex items-start gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5 mt-0.5" /> : <AlertCircle className="w-5 h-5 mt-0.5" />}
                    <p className="text-sm font-medium">{message.text}</p>
                </div>
            )}

            {viewMode === 'list' ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">All {subTab.charAt(0).toUpperCase() + subTab.slice(1)}s</h3>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 w-64"
                            />
                        </div>
                    </div>
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-900 font-medium">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">{subTab === 'student' ? 'Matric No' : 'Department'}</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-3 font-medium text-gray-900">
                                            {user.profile.firstName} {user.profile.lastName}
                                        </td>
                                        <td className="px-6 py-3">{user.email}</td>
                                        <td className="px-6 py-3">
                                            {subTab === 'student' ? user.profile.matricNo : user.profile.department || '-'}
                                        </td>
                                        <td className="px-6 py-3 text-right flex items-center justify-end gap-2">
                                            <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit (Coming Soon)">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Terminate User"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl mx-auto">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Register New {subTab.charAt(0).toUpperCase() + subTab.slice(1)}</h2>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                    type="text"
                                    required
                                    value={subTab === 'student' ? studentForm.firstName : subTab === 'lecturer' ? lecturerForm.firstName : staffForm.firstName}
                                    onChange={e => {
                                        const val = e.target.value;
                                        if (subTab === 'student') setStudentForm({ ...studentForm, firstName: val });
                                        else if (subTab === 'lecturer') setLecturerForm({ ...lecturerForm, firstName: val });
                                        else setStaffForm({ ...staffForm, firstName: val });
                                    }}
                                    className="w-full rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500 px-4 py-2 border shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    required
                                    value={subTab === 'student' ? studentForm.lastName : subTab === 'lecturer' ? lecturerForm.lastName : staffForm.lastName}
                                    onChange={e => {
                                        const val = e.target.value;
                                        if (subTab === 'student') setStudentForm({ ...studentForm, lastName: val });
                                        else if (subTab === 'lecturer') setLecturerForm({ ...lecturerForm, lastName: val });
                                        else setStaffForm({ ...staffForm, lastName: val });
                                    }}
                                    className="w-full rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500 px-4 py-2 border shadow-sm"
                                />
                            </div>
                        </div>

                        {(subTab === 'lecturer' || subTab === 'staff') && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <input
                                    type="text"
                                    required
                                    value={subTab === 'lecturer' ? lecturerForm.department : staffForm.department}
                                    onChange={e => {
                                        const val = e.target.value;
                                        if (subTab === 'lecturer') setLecturerForm({ ...lecturerForm, department: val });
                                        else setStaffForm({ ...staffForm, department: val });
                                    }}
                                    className="w-full rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500 px-4 py-2 border shadow-sm"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={subTab === 'student' ? studentForm.email : subTab === 'lecturer' ? lecturerForm.email : staffForm.email}
                                onChange={e => {
                                    const val = e.target.value;
                                    if (subTab === 'student') setStudentForm({ ...studentForm, email: val });
                                    else if (subTab === 'lecturer') setLecturerForm({ ...lecturerForm, email: val });
                                    else setStaffForm({ ...staffForm, email: val });
                                }}
                                className="w-full rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500 px-4 py-2 border shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                value={subTab === 'student' ? studentForm.password : subTab === 'lecturer' ? lecturerForm.password : staffForm.password}
                                onChange={e => {
                                    const val = e.target.value;
                                    if (subTab === 'student') setStudentForm({ ...studentForm, password: val });
                                    else if (subTab === 'lecturer') setLecturerForm({ ...lecturerForm, password: val });
                                    else setStaffForm({ ...staffForm, password: val });
                                }}
                                className="w-full rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500 px-4 py-2 border shadow-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 transition-colors ${loading ? 'opacity-70' : ''}`}
                        >
                            {loading ? 'Processing...' : `Register ${subTab.charAt(0).toUpperCase() + subTab.slice(1)}`}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

