import { getPlatformStats, getSchools, toggleSchoolStatus, createSchool } from "@/actions/super-admin";
import { MoveRight, School as SchoolIcon, Users, Activity, Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function SuperAdminDashboard() {
    const stats = await getPlatformStats();
    const schools = await getSchools();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Platform Overview</h1>
                        <p className="text-gray-500 mt-1">Welcome back, Super Admin.</p>
                    </div>
                    {/* Simple Add Button (Trigger Modal in real app, here simple form for MVP) */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hidden">
                        {/* Placeholder for modal trigger */}
                        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition">
                            <Plus className="w-4 h-4" /> Add School
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Total Schools"
                        value={stats.totalSchools}
                        icon={<SchoolIcon className="w-6 h-6 text-blue-600" />}
                        trend="+2 this month"
                    />
                    <StatCard
                        title="Active Schools"
                        value={stats.activeSchools}
                        icon={<Activity className="w-6 h-6 text-green-600" />}
                        trend="98% uptime"
                    />
                    <StatCard
                        title="Total Platform Users"
                        value={stats.totalUsers}
                        icon={<Users className="w-6 h-6 text-purple-600" />}
                        trend="Students, Staff, Lecturers"
                    />
                </div>

                {/* Schools List & Create Form */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* List */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-900">Registered Schools</h2>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {schools.length === 0 ? (
                                <div className="p-12 text-center text-gray-500">No schools found. Create one to get started.</div>
                            ) : (
                                schools.map((school) => (
                                    <div key={school.id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg">
                                                {school.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">{school.name}</h3>
                                                <p className="text-sm text-gray-500">{school._count.users} Users • {school.address || "No address"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${school.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {school.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                            <Link href={`/${school.id}/admin`} className="p-2 text-gray-400 hover:text-primary transition">
                                                <MoveRight className="w-5 h-5" />
                                            </Link>

                                            <form action={async () => {
                                                "use server";
                                                await toggleSchoolStatus(school.id, !school.isActive);
                                            }}>
                                                <button className="text-xs text-blue-600 hover:underline">
                                                    {school.isActive ? 'Deactivate' : 'Activate'}
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Create Form */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-fit">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-900">Onboard New School</h2>
                        </div>
                        <div className="p-6">
                            <form action={createSchool} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                        placeholder="ex. Springfield High"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <input
                                        name="address"
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                        placeholder="ex. 742 Evergreen Terrace"
                                    />
                                </div>
                                <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary/90 transition shadow-sm hover:shadow-md">
                                    Create School
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function StatCard({ title, value, icon, trend }: { title: string, value: number, icon: React.ReactNode, trend: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
                <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full">{trend}</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
            <p className="text-gray-500 text-sm">{title}</p>
        </div>
    )
}
