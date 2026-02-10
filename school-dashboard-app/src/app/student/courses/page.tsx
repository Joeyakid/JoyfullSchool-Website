'use client';

import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';

export default function StudentCourses() {
    const [courses, setCourses] = useState<any[]>([]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const { id } = JSON.parse(storedUser);
            fetch(`/api/student/course-progress?userId=${id}`)
                .then(res => res.json())
                .then(data => setCourses(data));
        }
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <a key={course.id} href={`/student/courses/${course.id}`} className="block">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{course.code}</h3>
                            <p className="text-gray-600 mb-4 h-12 overflow-hidden">{course.title}</p>

                            <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Progress</span>
                                <span>{course.progress}%</span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
