'use client';

import { useEffect, useState } from 'react';
import DashboardSection from '@/components/staff/DashboardSection';
import {
    CheckSquare,
    FileText,
    CalendarDays,
    TrendingUp,
    Megaphone,
    Briefcase
} from 'lucide-react';

export default function StaffDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (!storedUser) return;
                const { id } = JSON.parse(storedUser);

                const statsRes = await fetch(`/api/staff/stats?userId=${id}`);
                setStats(await statsRes.json());

                const announceRes = await fetch('/api/staff/announcements');
                setAnnouncements(await announceRes.json());
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
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Staff Operations Center</h1>

            <DashboardSection title="Overview" icon={TrendingUp}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center justify-center text-center border border-green-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3">
                            <CheckSquare className="w-6 h-6" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{stats?.pendingTasks || 0}</p>
                        <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mt-1">Pending Tasks</p>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-6 flex flex-col items-center justify-center text-center border border-blue-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
                            <FileText className="w-6 h-6" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{stats?.submittedReports || 0}</p>
                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mt-1">Reports Filed</p>
                    </div>

                    <div className="bg-orange-50 rounded-xl p-6 flex flex-col items-center justify-center text-center border border-orange-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-3">
                            <CalendarDays className="w-6 h-6" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{stats?.pendingLeave || 0}</p>
                        <p className="text-xs font-semibold text-orange-600 uppercase tracking-widest mt-1">Pending Leave</p>
                    </div>

                    <div className="bg-teal-50 rounded-xl p-6 flex flex-col items-center justify-center text-center border border-teal-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mb-3">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <p className="text-xl font-bold text-gray-900">{stats?.leaveBalance || 15} Days</p>
                        <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mt-1">Leave Balance</p>
                    </div>
                </div>
            </DashboardSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DashboardSection title="Internal Announcements" icon={Megaphone}>
                    <div className="space-y-4">
                        {announcements.map(ann => (
                            <div key={ann.id} className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                                <h4 className="font-bold text-gray-900 mb-1">{ann.title}</h4>
                                <p className="text-sm text-gray-700 mb-2">{ann.content}</p>
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span>{new Date(ann.date).toLocaleDateString()}</span>
                                    <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">{ann.author}</span>
                                </div>
                            </div>
                        ))}
                        {announcements.length === 0 && <p className="text-gray-500 text-sm text-center">No new announcements.</p>}
                    </div>
                </DashboardSection>

                <DashboardSection title="Quick Actions" icon={TrendingUp}>
                    <div className="grid grid-cols-2 gap-4">
                        <a href="/staff/reports" className="block p-4 bg-gray-50 border border-gray-100 rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors group">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                <FileText className="w-5 h-5" />
                            </div>
                            <h4 className="font-semibold text-gray-900">File Report</h4>
                            <p className="text-xs text-gray-500 mt-1">Submit incident or maintenance log</p>
                        </a>
                        <a href="/staff/leave" className="block p-4 bg-gray-50 border border-gray-100 rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors group">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                <CalendarDays className="w-5 h-5" />
                            </div>
                            <h4 className="font-semibold text-gray-900">Request Leave</h4>
                            <p className="text-xs text-gray-500 mt-1">Apply for time off</p>
                        </a>
                    </div>
                </DashboardSection>
            </div>
        </div>
    );
}
