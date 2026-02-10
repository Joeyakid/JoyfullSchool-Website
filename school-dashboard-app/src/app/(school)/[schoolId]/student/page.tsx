import { BookOpen, Award, TrendingUp } from "lucide-react";

export default function StudentDashboard({ params }: { params: { schoolId: string } }) {
    // Mock data for now since we don't have auth session to know WHICH student is logged in.
    const courses = [
        { id: 1, title: "Introduction to Computer Science", code: "CS101", grade: "A", score: 92 },
        { id: 2, title: "Calculus I", code: "MTH101", grade: "B+", score: 88 },
        { id: 3, title: "Physics I", code: "PHY101", grade: "A-", score: 90 },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
                    <p className="text-gray-500">Welcome back, Student.</p>
                </div>

                {/* Progress Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><BookOpen className="w-5 h-5" /></div>
                            <span className="font-medium text-gray-600">Enrolled Courses</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">5</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Award className="w-5 h-5" /></div>
                            <span className="font-medium text-gray-600">CGPA</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">3.8</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
                            <span className="font-medium text-gray-600">Credit Units</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">18</p>
                    </div>
                </div>

                {/* Current Results / Courses */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900">Academic Results</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {courses.map((course) => (
                                    <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.code}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{course.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.score}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${course.grade.startsWith('A') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {course.grade}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
