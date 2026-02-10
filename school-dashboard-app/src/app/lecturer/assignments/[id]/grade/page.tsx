'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, CheckCircle, ExternalLink } from 'lucide-react';
import Swal from 'sweetalert2';

export default function GradeAssignmentPage() {
    const params = useParams();
    const router = useRouter();
    const assignmentId = params.id as string;

    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubmissions();
    }, [assignmentId]);

    const fetchSubmissions = async () => {
        try {
            const res = await fetch(`/api/submissions?assignmentId=${assignmentId}`);
            if (res.ok) {
                setSubmissions(await res.json());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGrade = async (submissionId: string, grade: string) => {
        const numGrade = parseFloat(grade);
        if (isNaN(numGrade)) return;

        try {
            const res = await fetch('/api/lecturer/grade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ submissionId, grade: numGrade })
            });
            if (res.ok) {
                // Update local state
                setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, grade: numGrade, status: 'graded' } : s));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8">
            <button onClick={() => router.back()} className="flex items-center text-gray-500 hover:text-gray-900 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Assignment
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Grading: {assignmentId}</h1>
                <p className="text-gray-500">{submissions.length} Submissions</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase">
                            <tr>
                                <th className="px-6 py-3">Student Name</th>
                                <th className="px-6 py-3">Submitted At</th>
                                <th className="px-6 py-3">Content</th>
                                <th className="px-6 py-3 text-center">Grade (100)</th>
                                <th className="px-6 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {submissions.map(sub => (
                                <tr key={sub.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{sub.studentName}</td>
                                    <td className="px-6 py-4 text-gray-500">{new Date(sub.submittedAt).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-gray-600 truncate max-w-xs" title={sub.content}>
                                        {sub.type === 'quiz' ? (
                                            <span className="text-pink-600 font-medium">Quiz Answers: {sub.content}</span>
                                        ) : (
                                            <span className="flex items-center gap-2 cursor-pointer text-blue-600 hover:underline">
                                                <ExternalLink className="w-3 h-3" /> {sub.content}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <input
                                            type="number"
                                            min="0" max="100"
                                            defaultValue={sub.grade ?? ''}
                                            onBlur={(e) => handleGrade(sub.id, e.target.value)}
                                            className="w-20 text-center border rounded p-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="-"
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {sub.status === 'graded' ? (
                                            <span className="inline-flex items-center gap-1 text-green-600 font-medium px-2 py-0.5 bg-green-50 rounded-full text-xs">
                                                <CheckCircle className="w-3 h-3" /> Graded
                                            </span>
                                        ) : (
                                            <span className="text-orange-500 text-xs font-medium px-2 py-0.5 bg-orange-50 rounded-full">Pending</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {submissions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No submissions yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
