import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, AlertCircle, Search, CheckSquare, Square } from 'lucide-react';

export default function EnrollmentManagement() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Data
    const [studentsList, setStudentsList] = useState<{ id: string, name: string }[]>([]);
    const [coursesList, setCoursesList] = useState<{ id: string, code: string, title: string }[]>([]);

    // Selection State
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
    const [semester, setSemester] = useState('Second'); // Default to Second as per mock usage?

    useEffect(() => {
        fetchData();
    }, []);

    // When student is selected, we ideally want to fetch their current enrollments
    // But our current API might not expose that easily without a specific endpoint.
    // For now, we will just allow "Assingment". 
    // To make it better, let's fetch students with enrollments or just fetch enrollments for student.
    // MockDB has `getStudentEnrollments`. API could expose it. 
    // Let's assume for now we just purely "Add" enrollments. 
    // If better UX is needed, I'd fetch student's current courses.
    // Let's rely on the user knowing what they want to add.

    const fetchData = async () => {
        try {
            const res = await fetch('/api/school-admin/data');
            const data = await res.json();
            setStudentsList(data.students || []);
            setCoursesList(data.courses || []);
        } catch (err) {
            console.error("Failed to load data", err);
        }
    };

    const toggleCourse = (courseId: string) => {
        setSelectedCourseIds(prev =>
            prev.includes(courseId)
                ? prev.filter(id => id !== courseId)
                : [...prev, courseId]
        );
    };

    const handleEnroll = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudentId || selectedCourseIds.length === 0) {
            setMessage({ type: 'error', text: 'Please select a student and at least one course.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            // Sequential requests for simplicity (or Promise.all)
            const promises = selectedCourseIds.map(courseId =>
                fetch('/api/school-admin/assign-student', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        studentId: selectedStudentId,
                        courseId,
                        semester
                    })
                })
            );

            await Promise.all(promises);

            setMessage({ type: 'success', text: `Successfully enrolled student in ${selectedCourseIds.length} course(s).` });
            setSelectedCourseIds([]);
            setSelectedStudentId('');
        } catch (err: any) {
            setMessage({ type: 'error', text: 'Some enrollments may have failed.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Enrollment Management</h2>
                    <p className="text-gray-500 text-sm">Assign students to their courses for the semester.</p>
                    {message && (
                        <div className={`mt-4 p-3 rounded-lg inline-flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                            {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            <span className="text-sm font-medium">{message.text}</span>
                        </div>
                    )}
                </div>

                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Student Selection */}
                    <div className="md:col-span-1 space-y-4">
                        <label className="block text-sm font-bold text-gray-700">1. Select Student</label>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 max-h-96 overflow-y-auto">
                            {studentsList.length === 0 ? (
                                <p className="text-gray-400 text-sm text-center">No students found.</p>
                            ) : (
                                <div className="space-y-2">
                                    {studentsList.map(student => (
                                        <button
                                            key={student.id}
                                            onClick={() => setSelectedStudentId(student.id)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${selectedStudentId === student.id
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-100'
                                                }`}
                                        >
                                            <span className="truncate">{student.name}</span>
                                            {selectedStudentId === student.id && <CheckCircle className="w-3 h-3 flex-shrink-0" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="pt-4">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Semester</label>
                            <select
                                value={semester}
                                onChange={e => setSemester(e.target.value)}
                                className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border text-sm"
                            >
                                <option value="First">First Semester</option>
                                <option value="Second">Second Semester</option>
                            </select>
                        </div>
                    </div>

                    {/* Course Selection */}
                    <div className="md:col-span-2 space-y-4">
                        <label className="block text-sm font-bold text-gray-700">2. Select Courses to Assign</label>
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col h-96">
                            <div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center text-xs font-medium text-gray-500">
                                <span>{coursesList.length} Available Courses</span>
                                <span>{selectedCourseIds.length} Selected</span>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                {coursesList.length === 0 ? (
                                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                                        No courses available.
                                    </div>
                                ) : (
                                    coursesList.map(course => {
                                        const isSelected = selectedCourseIds.includes(course.id);
                                        return (
                                            <div
                                                key={course.id}
                                                onClick={() => toggleCourse(course.id)}
                                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${isSelected
                                                        ? 'bg-blue-50 border-blue-200'
                                                        : 'hover:bg-gray-50 border-transparent hover:border-gray-100'
                                                    }`}
                                            >
                                                <div className={`flex-shrink-0 ${isSelected ? 'text-blue-600' : 'text-gray-300'}`}>
                                                    {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>{course.code}</p>
                                                    <p className="text-xs text-gray-500">{course.title}</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                onClick={handleEnroll}
                                disabled={loading || !selectedStudentId || selectedCourseIds.length === 0}
                                className={`px-6 py-2.5 rounded-lg text-sm font-bold text-white shadow-sm transition-all ${loading || !selectedStudentId || selectedCourseIds.length === 0
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
                                    }`}
                            >
                                {loading ? 'Processing...' : `Enroll in ${selectedCourseIds.length} Course(s)`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
