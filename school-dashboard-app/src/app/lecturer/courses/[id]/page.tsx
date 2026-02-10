'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    BookOpen, Bell, FileText, MessageSquare,
    Plus, Trash2, ArrowLeft, Calendar, User
} from 'lucide-react';

export default function CourseManagementPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;

    const [activeTab, setActiveTab] = useState('overview');
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Data States
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [forums, setForums] = useState<any[]>([]);

    useEffect(() => {
        fetchCourseDetails();
    }, [courseId]);

    useEffect(() => {
        if (activeTab === 'announcements') fetchAnnouncements();
        if (activeTab === 'assignments') fetchAssignments();
        if (activeTab === 'forums') fetchForums();
    }, [activeTab]);

    const fetchCourseDetails = async () => {
        try {
            const res = await fetch(`/api/lecturer/courses/${courseId}`);
            if (res.ok) setCourse(await res.json());
            else router.push('/lecturer/dashboard');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAnnouncements = async () => {
        const res = await fetch(`/api/lecturer/courses/${courseId}/announcements`);
        if (res.ok) setAnnouncements(await res.json());
    };

    const fetchAssignments = async () => {
        const res = await fetch(`/api/lecturer/courses/${courseId}/assignments`);
        if (res.ok) setAssignments(await res.json());
    };

    const fetchForums = async () => {
        const res = await fetch(`/api/lecturer/courses/${courseId}/forums`);
        if (res.ok) setForums(await res.json());
    };

    // --- Actions ---
    const handlePostAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        await fetch(`/api/lecturer/courses/${courseId}/announcements`, {
            method: 'POST',
            body: JSON.stringify({
                title: formData.get('title'),
                content: formData.get('content'),
                author: 'Lecturer' // Get from session ideally
            })
        });
        form.reset();
        fetchAnnouncements();
    };

    const handleCreateAssignment = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        await fetch(`/api/lecturer/courses/${courseId}/assignments`, {
            method: 'POST',
            body: JSON.stringify({
                title: formData.get('title'),
                type: formData.get('type'),
                dueDate: formData.get('dueDate'),
                lecturerId: 'lecturer-1' // Mock
            })
        });
        form.reset();
        fetchAssignments();
    };

    const handleDelete = async (type: string, id: string) => {
        if (!confirm("Delete this item?")) return;
        await fetch(`/api/lecturer/courses/${courseId}/${type}?id=${id}`, { method: 'DELETE' });
        if (type === 'announcements') fetchAnnouncements();
        if (type === 'assignments') fetchAssignments();
        if (type === 'forums') fetchForums();
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!course) return <div className="p-8">Course not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8">
            <button onClick={() => router.back()} className="flex items-center text-gray-500 hover:text-gray-900 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{course.code}: {course.title}</h1>
                <p className="text-gray-500">{course.semester} Semester • {course.studentCount} Students Enrolled</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                {[
                    { id: 'overview', label: 'Overview', icon: BookOpen },
                    { id: 'announcements', label: 'Announcements', icon: Bell },
                    { id: 'assignments', label: 'Assignments & Quizzes', icon: FileText },
                    { id: 'forums', label: 'Forum', icon: MessageSquare },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${activeTab === tab.id
                            ? 'border-purple-600 text-purple-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="space-y-6">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-100">
                            <h3 className="font-bold text-lg mb-4">Course Description</h3>
                            <p className="text-gray-600 leading-relaxed">{course.description || "No description provided."}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-100">
                            <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button onClick={() => setActiveTab('announcements')} className="w-full text-left p-3 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 text-sm font-medium transition-colors">
                                    📢 Post an Announcement
                                </button>
                                <button onClick={() => setActiveTab('assignments')} className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium transition-colors">
                                    📝 Create an Assignment
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'announcements' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {announcements.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No announcements yet.</p>
                            ) : (
                                announcements.map(a => (
                                    <div key={a.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative group">
                                        <button
                                            onClick={() => handleDelete('announcements', a.id)}
                                            className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <h3 className="font-bold text-gray-900 mb-2">{a.title}</h3>
                                        <p className="text-gray-600 text-sm whitespace-pre-wrap">{a.content}</p>
                                        <div className="mt-4 flex items-center text-xs text-gray-400 gap-3">
                                            <span>{a.date}</span>
                                            <span>•</span>
                                            <span>{a.author}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div>
                            <div className="bg-white p-6 rounded-xl border border-gray-100 sticky top-6">
                                <h3 className="font-bold mb-4">New Announcement</h3>
                                <form onSubmit={handlePostAnnouncement} className="space-y-4">
                                    <input name="title" required placeholder="Title" className="w-full p-2 border rounded-lg text-sm" />
                                    <textarea name="content" required placeholder="Message" rows={4} className="w-full p-2 border rounded-lg text-sm" />
                                    <button className="w-full py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">Post</button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'assignments' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {assignments.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No assignments created.</p>
                            ) : (
                                assignments.map(a => (
                                    <div key={a.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between group">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${a.type === 'quiz' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {a.type}
                                                </span>
                                                <h3 className="font-bold text-gray-900">{a.title}</h3>
                                            </div>
                                            <p className="text-xs text-gray-500">Due: {a.dueDate || 'No date set'}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    // Open Grading Modal (Mock for now, would route to /lecturer/assignments/[id]/grade)
                                                    // For MVP, alerting or simple prompt
                                                    // Better: Redirect to a grading page.
                                                    router.push(`/lecturer/assignments/${a.id}/grade`);
                                                }}
                                                className="px-3 py-1 text-sm bg-purple-50 text-purple-600 rounded hover:bg-purple-100"
                                            >
                                                View Submissions
                                            </button>
                                            <button
                                                onClick={() => handleDelete('assignments', a.id)}
                                                className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div>
                            <div className="bg-white p-6 rounded-xl border border-gray-100 sticky top-6">
                                <h3 className="font-bold mb-4">Create Assignment</h3>
                                <form onSubmit={handleCreateAssignment} className="space-y-4">
                                    <input name="title" required placeholder="Title" className="w-full p-2 border rounded-lg text-sm" />
                                    <select name="type" className="w-full p-2 border rounded-lg text-sm">
                                        <option value="assignment">Assignment</option>
                                        <option value="quiz">Quiz</option>
                                    </select>
                                    <input name="dueDate" type="date" required className="w-full p-2 border rounded-lg text-sm" />
                                    <button className="w-full py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">Create</button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'forums' && (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="font-medium text-gray-900">Course Forum</h3>
                        <p className="text-gray-500 text-sm mt-1">Discussion board functionality coming soon.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
