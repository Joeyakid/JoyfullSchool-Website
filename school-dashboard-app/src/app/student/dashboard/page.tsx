'use client';

import { useEffect, useState } from 'react';
import DashboardSection from '@/components/student/DashboardSection';
import {
    BookOpen,
    Users,
    UserCheck,
    AlertCircle,
    CheckCircle2,
    Clock,
    MessageSquare,
    TrendingUp,
    FileText,
    Bell
} from 'lucide-react';

export default function StudentDashboard() {
    const [summary, setSummary] = useState<any>(null);
    const [progress, setProgress] = useState<any[]>([]);
    const [deadlines, setDeadlines] = useState<any>(null);
    const [forumActivity, setForumActivity] = useState<any[]>([]);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (!storedUser) return;
                const { id } = JSON.parse(storedUser);

                const [sumRes, progRes, deadRes, forumRes, annRes] = await Promise.all([
                    fetch(`/api/student/summary?userId=${id}`),
                    fetch(`/api/student/course-progress?userId=${id}`),
                    fetch(`/api/student/deadlines?userId=${id}`),
                    fetch(`/api/student/forum-activity?userId=${id}`),
                    fetch(`/api/student/announcements?userId=${id}`)
                ]);

                setSummary(await sumRes.json());
                setProgress(await progRes.json());
                setDeadlines(await deadRes.json());
                setForumActivity(await forumRes.json());
                setAnnouncements(await annRes.json());
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

            {/* 1. Summary Cards */}
            <DashboardSection title="Course & Grouping Information" icon={Users}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-green-50 rounded-xl p-6 flex items-center gap-4 border border-green-100 transform hover:scale-[1.02] transition-transform">
                        <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-sm">
                            <BookOpen className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">{summary?.activeCourses}</p>
                            <p className="text-sm font-medium text-green-700 uppercase tracking-wide">Active Courses</p>
                        </div>
                    </div>

                    <div className="bg-pink-50 rounded-xl p-6 flex items-center gap-4 border border-pink-100 transform hover:scale-[1.02] transition-transform">
                        <div className="w-14 h-14 bg-pink-500 rounded-full flex items-center justify-center text-white shadow-sm">
                            <Users className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">{summary?.activeGroupings}</p>
                            <p className="text-sm font-medium text-pink-700 uppercase tracking-wide">Course Groupings</p>
                        </div>
                    </div>

                    <div className="bg-orange-50 rounded-xl p-6 flex items-center gap-4 border border-orange-100 transform hover:scale-[1.02] transition-transform">
                        <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-sm">
                            <UserCheck className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">{summary?.tutorGroupings}</p>
                            <p className="text-sm font-medium text-orange-700 uppercase tracking-wide">Tutor Groupings</p>
                        </div>
                    </div>
                </div>
            </DashboardSection>

            {/* Announcements Section */}
            <DashboardSection title="Important Announcements" icon={Bell}>
                <div className="space-y-4">
                    {announcements.length > 0 ? (
                        announcements.map((ann: any) => (
                            <div key={ann.id} className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                                        <Bell className="w-5 h-5" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{ann.title}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{ann.content}</p>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 font-medium">
                                        <span>{ann.date}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span className="text-amber-700">From: {ann.author}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500">
                            No active announcements at this time.
                        </div>
                    )}
                </div>
            </DashboardSection>

            {/* 2. Course Progress Table */}
            <DashboardSection title="Course Progress Information" icon={TrendingUp}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Course Name</th>
                                <th className="px-6 py-3 font-semibold">Assignment Completion</th>
                                <th className="px-6 py-3 font-semibold">Quiz Completion</th>
                                <th className="px-6 py-3 font-semibold">Forum Participation</th>
                                <th className="px-6 py-3 font-semibold">Progress</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {progress.map((course) => (
                                <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-blue-600">
                                        {course.code} - {course.title}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{course.assignmentCompletion}</td>
                                    <td className="px-6 py-4 text-gray-600">{course.quizCompletion}</td>
                                    <td className="px-6 py-4 text-gray-600">{course.forumParticipation}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-full max-w-[100px] h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${course.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                                                    style={{ width: `${course.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-medium text-gray-500">{course.progress}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </DashboardSection>

            {/* 3. Deadlines */}
            <DashboardSection title="Deadlines" icon={Clock}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Quizzes */}
                    <div className="bg-blue-50/50 rounded-xl border border-blue-100 overflow-hidden">
                        <div className="bg-blue-100/50 px-4 py-3 border-b border-blue-200">
                            <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> Quiz Deadlines
                            </h3>
                        </div>
                        <div className="p-4 space-y-3">
                            {deadlines?.quizzes?.length > 0 ? (
                                deadlines.quizzes.map((quiz: any) => (
                                    <div key={quiz.id} className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{quiz.title}</p>
                                            <p className="text-xs text-blue-600 font-semibold">{quiz.course}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${quiz.isOverdue ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {quiz.date}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 bg-white rounded-lg border border-red-100 text-red-600 text-sm">
                                    No gradable quiz with deadline for you yet!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Assignments */}
                    <div className="bg-indigo-50/50 rounded-xl border border-indigo-100 overflow-hidden">
                        <div className="bg-indigo-100/50 px-4 py-3 border-b border-indigo-200">
                            <h3 className="font-semibold text-indigo-800 flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Assignment Deadlines
                            </h3>
                        </div>
                        <div className="p-4 space-y-3">
                            {deadlines?.assignments?.length > 0 ? (
                                deadlines.assignments.map((ass: any) => (
                                    <div key={ass.id} className="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{ass.title}</p>
                                            <p className="text-xs text-indigo-600 font-semibold">{ass.course}</p>
                                        </div>
                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                            {ass.date}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 bg-white rounded-lg border border-red-100 text-red-600 text-sm">
                                    No gradable assignment with deadline for you yet!
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </DashboardSection>

            {/* 4. Forum Activity */}
            <DashboardSection title="Forum Activity - Latest topics & comments" icon={MessageSquare}>
                <div className="space-y-4">
                    {forumActivity.length > 0 ? (
                        forumActivity.map((post) => (
                            <div key={post.id} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                        <MessageSquare className="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-sm font-semibold text-gray-900">{post.topic} <span className="text-gray-400 font-normal">• {post.course}</span></h4>
                                        <span className="text-xs text-gray-400">{post.date}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{post.content}</p>
                                    <p className="text-xs text-blue-600 font-medium mt-2">Posted by {post.author}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-6 bg-red-50 border border-red-100 rounded-xl text-center">
                            <p className="text-red-800 font-medium">We're sorry we can't display any forum activity</p>
                            <p className="text-red-600 text-sm mt-1">No course forum yet!</p>
                        </div>
                    )}
                </div>
            </DashboardSection>

        </div>
    );
}
