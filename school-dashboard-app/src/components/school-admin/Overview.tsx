import { Users, BookOpen, GraduationCap } from 'lucide-react';

export default function Overview() {
    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg text-white p-8">
                <h2 className="text-2xl font-bold mb-4">Welcome back, Admin</h2>
                <p className="opacity-90 leading-relaxed max-w-2xl">
                    This is your control center for managing the school.
                    Manage users, courses, Annoucement and enrollments.
                </p>
                <div className="mt-6 flex items-center gap-4 text-sm font-medium bg-white/10 p-3 rounded-lg backdrop-blur-sm w-fit">
                    <span className="bg-white text-orange-600 px-2 py-0.5 rounded text-xs font-bold">INFO</span>
                    <span>This system is running is Mock Mode ooooooo</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Students" value="--" icon={<GraduationCap className="w-6 h-6 text-blue-600" />} />
                <StatCard title="Total Lecturers" value="--" icon={<Users className="w-6 h-6 text-purple-600" />} />
                <StatCard title="Active Courses" value="--" icon={<BookOpen className="w-6 h-6 text-orange-600" />} />
            </div>
        </div>
    );
}

function StatCard({ title, value, icon }: any) {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">{icon}</div>
            <div>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                <p className="text-gray-500 text-sm">{title}</p>
            </div>
        </div>
    )
}
