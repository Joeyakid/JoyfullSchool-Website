import { BookOpen, Users } from "lucide-react";

export default function LecturerDashboard({ params }: { params: { schoolId: string } }) {
    // Mock data
    const courses = [
        { id: 1, title: "Introduction to Computer Science", code: "COSC101", students: 45 },
        { id: 2, title: "Data Structures", code: "COSC201", students: 32 },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Lecturer Portal</h1>
                        <p className="text-gray-500">Manage your courses and student results.</p>
                    </div>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition text-sm font-medium">
                        Upload Results
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div key={course.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                    {course.code}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Users className="w-4 h-4" />
                                <span>{course.students} Students Enrolled</span>
                            </div>
                            <button className="mt-4 w-full border border-gray-200 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
                                View Details
                            </button>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
