'use client';

import { useEffect, useState } from 'react';
import DashboardSection from '@/components/lecturer/DashboardSection';
import {
    BookOpen,
    Users,
    FileText,
    TrendingUp
} from 'lucide-react';

export default function LecturerDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (!storedUser) return;
                const { id } = JSON.parse(storedUser);

                const res = await fetch(`/api/lecturer/stats?userId=${id}`);
                setStats(await res.json());
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
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Lecturer Overview</h1>

            <DashboardSection title="Academic Summary" icon={TrendingUp}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-purple-50 rounded-xl p-6 flex flex-col items-center justify-center text-center border border-purple-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-3">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{stats?.totalCourses || 0}</p>
                        <p className="text-xs font-semibold text-purple-600 uppercase tracking-widest mt-1">Active Courses</p>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-6 flex flex-col items-center justify-center text-center border border-blue-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
                            <Users className="w-6 h-6" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{stats?.totalStudents || 0}</p>
                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mt-1">Total Students</p>
                    </div>

                    <div className="bg-orange-50 rounded-xl p-6 flex flex-col items-center justify-center text-center border border-orange-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-3">
                            <FileText className="w-6 h-6" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{stats?.activeAssignments || 0}</p>
                        <p className="text-xs font-semibold text-orange-600 uppercase tracking-widest mt-1">Assignments / Quizzes</p>
                    </div>

                    <div className="bg-pink-50 rounded-xl p-6 flex flex-col items-center justify-center text-center border border-pink-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 mb-3">
                            <FileText className="w-6 h-6" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{stats?.pendingMarking || 0}</p>
                        <p className="text-xs font-semibold text-pink-600 uppercase tracking-widest mt-1">Pending Marking</p>
                    </div>
                </div>
            </DashboardSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DashboardSection title="Recent Activity" icon={TrendingUp}>
                    <div className="text-sm text-gray-500 text-center py-8">
                        No recent activity to display.
                    </div>
                </DashboardSection>
                <DashboardSection title="System Notices" icon={TrendingUp}>
                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-800 text-sm">Grading Deadline</h4>
                        <p className="text-xs text-yellow-700 mt-1">Please ensure all CA results are uploaded by friday.</p>
                    </div>
                </DashboardSection>
            </div>
        </div>
    );
}
