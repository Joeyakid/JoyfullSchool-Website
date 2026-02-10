'use client';

import { useState, useEffect } from 'react';
import DashboardSection from '@/components/lecturer/DashboardSection';
import { FileText, Plus, Calendar, Clock } from 'lucide-react';

export default function LecturerAssignments() {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newAssignment, setNewAssignment] = useState({ title: '', courseId: '', type: 'assignment', dueDate: '' });

    const fetchData = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const { id } = JSON.parse(storedUser);
            // Fetch assignments
            fetch(`/api/lecturer/assignments?userId=${id}`)
                .then(res => res.json())
                .then(data => setAssignments(data));

            // Fetch courses for dropdown
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

        await fetch('/api/lecturer/assignments', {
            method: 'POST',
            body: JSON.stringify({ userId: id, ...newAssignment })
        });
        setShowModal(false);
        setNewAssignment({ title: '', courseId: '', type: 'assignment', dueDate: '' });
        fetchData();
    };

    // Helper to get course code
    const getCourseCode = (cId: string) => courses.find(c => c.id === cId)?.code || 'Unknown';

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Assignments & Quizzes</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add New
                </button>
            </div>

            <div className="space-y-4">
                {assignments.map(assign => (
                    <div key={assign.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:border-purple-200 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${assign.type === 'quiz' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                {assign.type === 'quiz' ? <Clock className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">{assign.title}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                    <span className="font-medium text-gray-700">{getCourseCode(assign.courseId)}</span>
                                    <span>•</span>
                                    <span className="capitalize">{assign.type}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Due: {assign.dueDate}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
                {assignments.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl text-gray-500 border border-dashed">
                        No assignments or quizzes created yet.
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">Add Assignment / Quiz</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input type="text" required className="w-full border rounded-lg p-2" value={newAssignment.title} onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select className="w-full border rounded-lg p-2" value={newAssignment.type} onChange={e => setNewAssignment({ ...newAssignment, type: e.target.value })}>
                                    <option value="assignment">Assignment</option>
                                    <option value="quiz">Quiz</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                                <select className="w-full border rounded-lg p-2" required value={newAssignment.courseId} onChange={e => setNewAssignment({ ...newAssignment, courseId: e.target.value })}>
                                    <option value="">Select Course</option>
                                    {courses.map(c => <option key={c.id} value={c.id}>{c.code} - {c.title}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                <input type="date" required className="w-full border rounded-lg p-2" value={newAssignment.dueDate} onChange={e => setNewAssignment({ ...newAssignment, dueDate: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
