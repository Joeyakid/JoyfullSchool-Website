'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    BookOpen, Bell, FileText, MessageSquare,
    ArrowLeft, Clock, Upload, Send
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function StudentCourseDetail() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;

    const [activeTab, setActiveTab] = useState('overview');
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [forums, setForums] = useState<any[]>([]);

    // Interaction States
    const [selectedForumPost, setSelectedForumPost] = useState<any>(null);
    const [forumComments, setForumComments] = useState<any[]>([]);
    const [commentInput, setCommentInput] = useState('');
    const [grades, setGrades] = useState<Record<string, any>>({}); // assignmentId -> submission

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) setUser(JSON.parse(stored));
        fetchCourseAndContent();
    }, [courseId]);

    const fetchCourseAndContent = async () => {
        try {
            const courseRes = await fetch(`/api/lecturer/courses/${courseId}`);
            if (courseRes.ok) setCourse(await courseRes.json());
            else throw new Error("Course not found");

            const annRes = await fetch(`/api/lecturer/courses/${courseId}/announcements`);
            if (annRes.ok) setAnnouncements(await annRes.json());

            const assRes = await fetch(`/api/lecturer/courses/${courseId}/assignments`);
            if (assRes.ok) {
                const asses = await assRes.json();
                setAssignments(asses);
                // Fetch submissions
                if (localStorage.getItem('user')) {
                    const u = JSON.parse(localStorage.getItem('user')!);
                    asses.forEach(async (a: any) => {
                        const subRes = await fetch(`/api/submissions?assignmentId=${a.id}&studentId=${u.id}`);
                        if (subRes.ok) {
                            const sub = await subRes.json();
                            if (sub) setGrades(prev => ({ ...prev, [a.id]: sub }));
                        }
                    });
                }
            }

            const forumRes = await fetch(`/api/lecturer/courses/${courseId}/forums`);
            if (forumRes.ok) setForums(await forumRes.json());

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSubmit = async (assignmentId: string, type: 'assignment' | 'quiz') => {
        if (!user) return;

        // Mock File Select
        const { value: file } = await Swal.fire({
            title: 'Select File',
            input: 'file',
            inputAttributes: {
                'accept': '.pdf,.docx,.txt',
                'aria-label': 'Upload your assignment'
            }
        });

        if (file) {
            Swal.showLoading();
            // Mock Upload
            await new Promise(r => setTimeout(r, 1000));

            const res = await fetch('/api/submissions', {
                method: 'POST',
                body: JSON.stringify({
                    assignmentId,
                    studentId: user.id,
                    studentName: `${user.profile.firstName} ${user.profile.lastName}`,
                    content: `File: ${file.name} (Mock URL)`,
                    type
                })
            });

            if (res.ok) {
                Swal.fire('Submitted!', 'Your work has been uploaded.', 'success');
                fetchCourseAndContent(); // Refresh to see status
            }
        }
    };

    const handleQuizSubmit = async (assignmentId: string) => {
        // Mock Quiz Interface
        const { value: formValues } = await Swal.fire({
            title: 'Quiz: General Knowledge',
            html:
                '<p class="mb-2 text-left">1. What is 2 + 2?</p>' +
                '<input id="swal-input1" class="swal2-input mb-4" placeholder="Answer">' +
                '<p class="mb-2 text-left mt-4">2. Capital of France?</p>' +
                '<input id="swal-input2" class="swal2-input" placeholder="Answer">',
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                return [
                    (document.getElementById('swal-input1') as HTMLInputElement).value,
                    (document.getElementById('swal-input2') as HTMLInputElement).value
                ]
            }
        });

        if (formValues) {
            const res = await fetch('/api/submissions', {
                method: 'POST',
                body: JSON.stringify({
                    assignmentId,
                    studentId: user.id,
                    studentName: `${user.profile.firstName} ${user.profile.lastName}`,
                    content: `Answers: ${formValues.join(', ')}`,
                    type: 'quiz'
                })
            });
            if (res.ok) {
                Swal.fire('Completed!', 'Quiz submitted successfully.', 'success');
                fetchCourseAndContent();
            }
        }
    };

    const loadComments = async (postId: string) => {
        const res = await fetch(`/api/forum/comments?postId=${postId}`);
        if (res.ok) setForumComments(await res.json());
    };

    const handlePostComment = async () => {
        if (!commentInput.trim() || !selectedForumPost || !user) return;

        const res = await fetch('/api/forum/comments', {
            method: 'POST',
            body: JSON.stringify({
                postId: selectedForumPost.id,
                content: commentInput,
                authorId: user.id,
                authorName: `${user.profile.firstName} ${user.profile.lastName}`,
                authorRole: 'student'
            })
        });

        if (res.ok) {
            setCommentInput('');
            loadComments(selectedForumPost.id);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!course) return <div className="p-8">Course not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8">
            <button onClick={() => router.back()} className="flex items-center text-gray-500 hover:text-gray-900 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{course.code}: {course.title}</h1>
                <p className="text-gray-500">{course.semester} Semester</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                {[
                    { id: 'overview', label: 'Overview', icon: BookOpen },
                    { id: 'announcements', label: 'Announcements', icon: Bell },
                    { id: 'assignments', label: 'Assignments', icon: FileText },
                    { id: 'forums', label: 'Forum', icon: MessageSquare },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${activeTab === tab.id
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="space-y-6">
                {activeTab === 'overview' && (
                    <div className="bg-white p-6 rounded-xl border border-gray-100">
                        <h3 className="font-bold text-lg mb-4">Course Description</h3>
                        <p className="text-gray-600 leading-relaxed">{course.description || "No description provided."}</p>
                    </div>
                )}

                {activeTab === 'announcements' && (
                    <div className="space-y-4">
                        {announcements.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No announcements.</p>
                        ) : (
                            announcements.map(a => (
                                <div key={a.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
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
                )}

                {activeTab === 'assignments' && (
                    <div className="space-y-4">
                        {assignments.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No active assignments.</p>
                        ) : (
                            assignments.map(a => {
                                const submission = grades[a.id];
                                return (
                                    <div key={a.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${a.type === 'quiz' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        {a.type}
                                                    </span>
                                                    <h3 className="font-bold text-gray-900">{a.title}</h3>
                                                </div>
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> Due: {a.dueDate || 'No date set'}
                                                </p>
                                            </div>
                                            {submission && (
                                                <div className="text-right">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${submission.grade !== undefined && submission.grade !== null ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {submission.grade !== undefined && submission.grade !== null ? `Grade: ${submission.grade}/100` : 'Submitted'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {!submission ? (
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                {a.type === 'quiz' ? (
                                                    <button
                                                        onClick={() => handleQuizSubmit(a.id)}
                                                        className="w-full py-2 bg-pink-600 text-white rounded-lg text-sm font-bold hover:bg-pink-700 transition-colors"
                                                    >
                                                        Start Quiz
                                                    </button>
                                                ) : (
                                                    <div className="flex justify-end">
                                                        <button
                                                            onClick={() => handleFileSubmit(a.id, 'assignment')}
                                                            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                                                        >
                                                            <Upload className="w-4 h-4" /> Upload Answer
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
                                                <p>Submitted: {new Date(submission.submittedAt).toLocaleDateString()}</p>
                                                <p className="italic mt-1 text-xs text-gray-500">Content: {submission.content}</p>
                                            </div>
                                        )}
                                    </div>
                                )
                            })
                        )}
                    </div>
                )}

                {activeTab === 'forums' && (
                    <div className="space-y-6">
                        {/* Back to list if post selected */}
                        {selectedForumPost ? (
                            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 bg-gray-50">
                                    <button onClick={() => setSelectedForumPost(null)} className="text-xs text-gray-500 hover:text-gray-900 mb-2 underline">Back to Discussions</button>
                                    <h3 className="font-bold text-xl text-gray-900">{selectedForumPost.title}</h3>
                                    <p className="text-gray-600 mt-2">{selectedForumPost.content}</p>
                                    <div className="mt-4 text-xs text-gray-400">Posted by {selectedForumPost.authorName} on {selectedForumPost.date}</div>
                                </div>
                                <div className="p-6 bg-gray-50/50 space-y-4 max-h-96 overflow-y-auto">
                                    {forumComments.map(c => (
                                        <div key={c.id} className={`p-4 rounded-lg flex gap-3 ${c.authorRole === 'lecturer' ? 'bg-purple-50 border border-purple-200 ml-8' : 'bg-white border border-gray-200'}`}>
                                            {/* Avatar Placeholder */}
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${c.authorRole === 'lecturer' ? 'bg-purple-200 text-purple-700' : 'bg-gray-200 text-gray-700'}`}>
                                                {c.authorName[0]}
                                            </div>
                                            <div className='flex-1'>
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className={`text-xs font-bold ${c.authorRole === 'lecturer' ? 'text-purple-700' : 'text-gray-900'}`}>
                                                        {c.authorName} {c.authorRole === 'lecturer' && '(Lecturer)'}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-gray-700 text-sm">{c.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {forumComments.length === 0 && <p className="text-gray-400 text-center text-sm">No comments yet.</p>}
                                </div>
                                <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
                                    <input
                                        value={commentInput}
                                        onChange={e => setCommentInput(e.target.value)}
                                        placeholder="Write a reply..."
                                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button onClick={handlePostComment} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // List Posts
                            forums.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No discussions yet.</p>
                            ) : (
                                forums.map(post => (
                                    <div key={post.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:border-blue-300 transition-colors"
                                        onClick={() => { setSelectedForumPost(post); loadComments(post.id); }}>
                                        <h3 className="font-bold text-gray-900 mb-1">{post.title}</h3>
                                        <p className="text-gray-600 text-sm line-clamp-2">{post.content}</p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-xs text-gray-500">By {post.authorName}</span>
                                            <span className="text-xs font-medium text-blue-600">View Discussion</span>
                                        </div>
                                    </div>
                                ))
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
