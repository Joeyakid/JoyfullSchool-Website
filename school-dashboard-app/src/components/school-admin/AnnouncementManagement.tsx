import { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Calendar, User } from 'lucide-react';

export default function AnnouncementManagement() {
    const [viewMode, setViewMode] = useState<'list' | 'create'>('list');
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form State
    const [form, setForm] = useState({
        title: '',
        content: '',
        author: 'School Admin'
    });

    useEffect(() => {
        if (viewMode === 'list') {
            fetchAnnouncements();
        }
    }, [viewMode]);

    const fetchAnnouncements = async () => {
        try {
            const res = await fetch('/api/school-admin/announcements');
            if (res.ok) setAnnouncements(await res.json());
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/school-admin/announcements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Announcement posted successfully!' });
                setForm({ title: '', content: '', author: 'School Admin' });
                setTimeout(() => setViewMode('list'), 1500);
            } else {
                throw new Error('Failed to post announcement');
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this announcement?')) return;
        try {
            const res = await fetch(`/api/school-admin/announcements?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setAnnouncements(announcements.filter(a => a.id !== id));
                setMessage({ type: 'success', text: 'Announcement deleted.' });
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 border-l-4 border-amber-500 pl-3">Announcement Management</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg border ${viewMode === 'list' ? 'bg-white border-gray-300 shadow-sm' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        View List
                    </button>
                    <button
                        onClick={() => { setViewMode('create'); setMessage(null); }}
                        className={`px-4 py-2 text-sm font-medium rounded-lg border flex items-center gap-2 ${viewMode === 'create' ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    >
                        <Plus className="w-4 h-4" />
                        New Announcement
                    </button>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    <span className="font-medium text-sm">{message.text}</span>
                </div>
            )}

            {viewMode === 'list' ? (
                <div className="grid gap-4">
                    {announcements.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No announcements posted yet.</p>
                        </div>
                    ) : (
                        announcements.map(announcement => (
                            <div key={announcement.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group">
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleDelete(announcement.id)}
                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                        title="Delete Announcement"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{announcement.title}</h3>
                                <p className="text-gray-600 mb-4 whitespace-pre-wrap">{announcement.content}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {announcement.date}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        {announcement.author}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl mx-auto">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Post New Announcement</h3>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. End of Semester Break"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500 px-4 py-2 border shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                            <textarea
                                rows={5}
                                required
                                placeholder="Write your announcement here..."
                                value={form.content}
                                onChange={e => setForm({ ...form, content: e.target.value })}
                                className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500 px-4 py-2 border shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Author Name (Optional)</label>
                            <input
                                type="text"
                                value={form.author}
                                onChange={e => setForm({ ...form, author: e.target.value })}
                                className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500 px-4 py-2 border shadow-sm"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-sm"
                            >
                                {loading ? 'Posting...' : 'Post Announcement'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
