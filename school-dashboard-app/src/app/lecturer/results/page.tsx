'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Upload, Save, CheckCircle, Search } from 'lucide-react';

export default function LecturerResults() {
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [students, setStudents] = useState<any[]>([]);
    const [results, setResults] = useState<any[]>([]); // Existing results
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const { id } = JSON.parse(storedUser);
            fetch(`/api/lecturer/courses?userId=${id}`)
                .then(res => res.json())
                .then(data => setCourses(data));
        }
    }, []);

    useEffect(() => {
        if (!selectedCourseId) return;
        fetchClassData();
    }, [selectedCourseId]);

    const fetchClassData = async () => {
        setLoading(true);
        try {
            // 1. Get Enrolled Students
            const stdRes = await fetch(`/api/lecturer/courses/${selectedCourseId}/students`); // Need to ensure this exists or use enrollments
            // Mocking logic: We probably don't have a direct "get students for course" API yet that returns full profiles easily.
            // Let's create/use a route for this: /api/lecturer/courses/[id]/enrollments 
            // For now, let's assume I create a helper route or use existing logic.
            // I'll create a new API route: /api/lecturer/courses/[id]/results-data which returns students AND current results

            const res = await fetch(`/api/lecturer/courses/${selectedCourseId}/results-data`);
            if (res.ok) {
                const data = await res.json();
                setStudents(data.students);
                setResults(data.results);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleScoreChange = (studentId: string, score: string) => {
        const newResults = [...results];
        const index = newResults.findIndex(r => r.studentId === studentId);
        if (index > -1) {
            newResults[index].score = Number(score);
        } else {
            newResults.push({ studentId, score: Number(score), total: 100, type: 'exam' });
        }
        setResults(newResults);
    };

    const handleSaveResults = async () => {
        setLoading(true);
        // Save all changes
        try {
            await fetch(`/api/lecturer/courses/${selectedCourseId}/results-data`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ results })
            });
            Swal.fire('Success', 'Results saved successfully.', 'success');
        } catch (e) {
            Swal.fire('Error', 'Failed to save results.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Results Management</h1>

            {/* Course Selector */}
            <div className="mb-8 max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
                <select
                    className="w-full p-2 border rounded-lg shadow-sm"
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                >
                    <option value="">-- Choose a Course --</option>
                    {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                    ))}
                </select>
            </div>

            {selectedCourseId && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="font-bold text-lg">Student List & Grades</h2>
                        <button
                            onClick={handleSaveResults}
                            disabled={loading}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" /> Save Results
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase">
                                <tr>
                                    <th className="px-6 py-3">Student Name</th>
                                    <th className="px-6 py-3">Matric No</th>
                                    <th className="px-6 py-3 text-center">Exam Score (100)</th>
                                    <th className="px-6 py-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {students.map(student => {
                                    const result = results.find(r => r.studentId === student.id);
                                    const score = result ? result.score : '';
                                    return (
                                        <tr key={student.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{student.profile.firstName} {student.profile.lastName}</td>
                                            <td className="px-6 py-4 text-gray-500">{student.profile.matricNo || 'N/A'}</td>
                                            <td className="px-6 py-4 text-center">
                                                <input
                                                    type="number"
                                                    min="0" max="100"
                                                    value={score}
                                                    onChange={(e) => handleScoreChange(student.id, e.target.value)}
                                                    className="w-20 text-center border rounded p-1 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {result ? <span className="text-green-600 font-medium">Recorded</span> : <span className="text-gray-400">Pending</span>}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {students.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No students enrolled in this course.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
