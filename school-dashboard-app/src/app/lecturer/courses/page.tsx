'use client';

import { useState, useEffect } from 'react';
import DashboardSection from '@/components/lecturer/DashboardSection';
import { BookOpen, Plus, Trash2, Calendar } from 'lucide-react';

export default function LecturerCourses() {
    const [courses, setCourses] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newCourse, setNewCourse] = useState({ code: '', title: '', semester: 'First', description: '' });

    const fetchCourses = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const { id } = JSON.parse(storedUser);
            fetch(`/api/lecturer/courses?userId=${id}`)
                .then(res => res.json())
                .then(data => setCourses(data));
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;
        const { id } = JSON.parse(storedUser);

        await fetch('/api/lecturer/courses', {
            method: 'POST',
            body: JSON.stringify({ userId: id, ...newCourse })
        });
        setShowModal(false);
        setNewCourse({ code: '', title: '', semester: 'First', description: '' });
        fetchCourses();
    };

    const handleDelete = async (courseId: string) => {
        if (!confirm('Are you sure you want to delete this course?')) return;
        await fetch(`/api/lecturer/courses?courseId=${courseId}`, { method: 'DELETE' });
        fetchCourses();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Create Course
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <button onClick={() => handleDelete(course.id)} className="text-gray-400 hover:text-red-600 p-1">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-1">{course.code}</h3>
                        <h4 className="text-sm font-medium text-gray-700 mb-2 h-10 overflow-hidden">{course.title}</h4>
                        <p className="text-xs text-gray-500 mb-4 flex-1">{course.description}</p>

                        <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {course.semester} Semester
                            </span>
                            <span className="bg-gray-100 px-2 py-1 rounded-full">{course.studentCount} Students</span>
                        </div>
                    </div>
                ))}
                {courses.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
                        No courses found. Create one to get started.
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">Add New Course</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                                <input type="text" required className="w-full border rounded-lg p-2" placeholder="e.g. COSC 101" value={newCourse.code} onChange={e => setNewCourse({ ...newCourse, code: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                                <input type="text" required className="w-full border rounded-lg p-2" placeholder="e.g. Intro to CS" value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea className="w-full border rounded-lg p-2" rows={3} value={newCourse.description} onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                                <select className="w-full border rounded-lg p-2" value={newCourse.semester} onChange={e => setNewCourse({ ...newCourse, semester: e.target.value })}>
                                    <option>First</option>
                                    <option>Second</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Create Course</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
