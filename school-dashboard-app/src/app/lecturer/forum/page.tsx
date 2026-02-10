'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Plus } from 'lucide-react';

export default function LecturerForum() {
    const [posts, setPosts] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '', courseId: '' });

    const fetchData = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const { id } = JSON.parse(storedUser);
            fetch(`/api/lecturer/forum?userId=${id}`)
                .then(res => res.json())
                .then(data => setPosts(data));

            fetch(`/api/lecturer/courses?userId=${id}`)
                .then(res => res.json())
                .then(data => setCourses(data));
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;
        const { id } = JSON.parse(storedUser);

        await fetch('/api/lecturer/forum', {
            method: 'POST',
            body: JSON.stringify({ userId: id, ...newPost })
        });
        setShowModal(false);
        setNewPost({ title: '', content: '', courseId: '' });
        fetchData();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Course Forums</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> New Topic
                </button>
            </div>

            <div className="space-y-4">
                {posts.map(post => {
                    const courseCode = courses.find(c => c.id === post.courseId)?.code || 'General';
                    return (
                        <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex gap-4 hover:bg-gray-50 transition-colors">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-lg font-bold text-gray-900">{post.title}</h4>
                                    <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{courseCode}</span>
                                </div>
                                <p className="text-gray-600 mt-2 text-sm">{post.content}</p>
                                <div className="mt-4 text-xs text-gray-500">
                                    Posted on {new Date(post.date).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    );
                })}
                {posts.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl text-gray-500 border border-dashed">
                        No forum posts created yet.
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">Create Discussion Topic</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Topic Title</label>
                                <input type="text" required className="w-full border rounded-lg p-2" value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                                <select className="w-full border rounded-lg p-2" required value={newPost.courseId} onChange={e => setNewPost({ ...newPost, courseId: e.target.value })}>
                                    <option value="">Select Course</option>
                                    {courses.map(c => <option key={c.id} value={c.id}>{c.code} - {c.title}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea className="w-full border rounded-lg p-2" rows={4} value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Post</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
