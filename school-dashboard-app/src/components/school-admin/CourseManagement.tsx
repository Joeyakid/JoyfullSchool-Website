import { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Search, User } from 'lucide-react';

/* 
  CourseManagement Component
  - Lists all courses
  - Allows filtering/searching (client-side for now)
  - Creates new courses with lecturer assignment
  - Deletes courses
*/

export default function CourseManagement() {
    const [viewMode, setViewMode] = useState<'list' | 'create'>('list');
    const [courses, setCourses] = useState<any[]>([]);
    const [lecturers, setLecturers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form State
    const [courseForm, setCourseForm] = useState({
        code: '',
        title: '',
        description: '',
        semester: 'First',
        lecturerId: ''
    });

    useEffect(() => {
        if (viewMode === 'list') {
            fetchCourses();
        }
        if (viewMode === 'create' && lecturers.length === 0) {
            fetchLecturers();
        }
    }, [viewMode]);

    const fetchCourses = async () => {
        try {
            const res = await fetch('/api/school-admin/courses');
            if (res.ok) setCourses(await res.json());
        } catch (err) {
            console.error(err);
        }
    };

    const fetchLecturers = async () => {
        try {
            const res = await fetch('/api/school-admin/users?role=lecturer');
            if (res.ok) setLecturers(await res.json());
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/school-admin/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(courseForm)
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Course created successfully!' });
                setCourseForm({ code: '', title: '', description: '', semester: 'First', lecturerId: '' });
                // Return to list after short delay? Or just stay here?
                // Let's go to list to see the new course
                setTimeout(() => setViewMode('list'), 1500);
            } else {
                throw new Error('Failed to create course');
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this course?')) return;
        try {
            const res = await fetch(`/api/school-admin/courses?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setCourses(courses.filter(c => c.id !== id));
                setMessage({ type: 'success', text: 'Course deleted.' });
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 border-l-4 border-orange-600 pl-3">Course Management</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg border ${viewMode === 'list' ? 'bg-white border-gray-300 shadow-sm' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        View List
                    </button>
                    <button
                        onClick={() => { setViewMode('create'); setMessage(null); }}
                        className={`px-4 py-2 text-sm font-medium rounded-lg border flex items-center gap-2 ${viewMode === 'create' ? 'bg-orange-600 text-white border-orange-600 shadow-sm' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    >
                        <Plus className="w-4 h-4" />
                        Add Course
                    </button>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    <span className="font-medium text-sm">{message.text}</span>
                </div>
            )}

            {viewMode === 'list' ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-500">
                            <BookOpen className="w-5 h-5" />
                            <span className="text-sm font-medium">{courses.length} Active Courses</span>
                        </div>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 w-64"
                            />
                        </div>
                    </div>
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-900 font-medium">
                            <tr>
                                <th className="px-6 py-3">Code</th>
                                <th className="px-6 py-3">Title</th>
                                <th className="px-6 py-3">Lecturer</th>
                                <th className="px-6 py-3">Semester</th>
                                <th className="px-6 py-3">Students</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {courses.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No courses found.</td></tr>
                            ) : (
                                courses.map(course => (
                                    <tr key={course.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-3 font-medium text-gray-900">{course.code}</td>
                                        <td className="px-6 py-3">{course.title}</td>
                                        <td className="px-6 py-3">
                                            {course.lecturerName !== 'Unassigned' ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-bold">
                                                        {course.lecturerName.charAt(0)}
                                                    </div>
                                                    {course.lecturerName}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3">{course.semester}</td>
                                        <td className="px-6 py-3">{course.studentCount}</td>
                                        <td className="px-6 py-3 text-right">
                                            <button
                                                onClick={() => handleDelete(course.id)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Create New Course</h3>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. CSC 101"
                                    value={courseForm.code}
                                    onChange={e => setCourseForm({ ...courseForm, code: e.target.value })}
                                    className="w-full rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500 px-4 py-2 border shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                                <select
                                    value={courseForm.semester}
                                    onChange={e => setCourseForm({ ...courseForm, semester: e.target.value })}
                                    className="w-full rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500 px-4 py-2 border shadow-sm"
                                >
                                    <option value="First">First Semester</option>
                                    <option value="Second">Second Semester</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Introduction to Computer Science"
                                value={courseForm.title}
                                onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
                                className="w-full rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500 px-4 py-2 border shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                rows={3}
                                value={courseForm.description}
                                onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                                className="w-full rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500 px-4 py-2 border shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Assign Lecturer</label>
                            <div className="relative">
                                <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                <select
                                    value={courseForm.lecturerId}
                                    onChange={e => setCourseForm({ ...courseForm, lecturerId: e.target.value })}
                                    className="w-full pl-9 rounded-lg border-gray-300 focus:ring-orange-500 focus:border-orange-500 px-4 py-2 border shadow-sm"
                                >
                                    <option value="">Select a lecturer...</option>
                                    {lecturers.map(lecturer => (
                                        <option key={lecturer.id} value={lecturer.id}>
                                            {lecturer.profile.firstName} {lecturer.profile.lastName} ({lecturer.profile.department})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 transition-colors shadow-sm"
                            >
                                {loading ? 'Creating...' : 'Create Course'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
