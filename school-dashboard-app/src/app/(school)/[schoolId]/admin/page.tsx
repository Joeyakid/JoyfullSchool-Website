import { getSchoolStats, getUsers, createUser } from "@/actions/school-admin";
import { Users, BookOpen, GraduationCap, Plus } from "lucide-react";

export default async function SchoolAdminDashboard({ params }: { params: { schoolId: string } }) {
    const { schoolId } = params;
    const stats = await getSchoolStats(schoolId);
    // Fetching users specifically for this school - simplifed to just students for this view or get all logic
    const students = await getUsers(schoolId, 'STUDENT');
    const lecturers = await getUsers(schoolId, 'LECTURER');

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{stats.school.name} Admin</h1>
                        <p className="text-gray-500 mt-1">Manage your school users and courses.</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Total Students" value={stats.totalStudents} icon={<GraduationCap className="w-6 h-6 text-blue-600" />} />
                    <StatCard title="Lecturers" value={stats.totalLecturers} icon={<Users className="w-6 h-6 text-purple-600" />} />
                    <StatCard title="Active Courses" value={stats.totalCourses} icon={<BookOpen className="w-6 h-6 text-orange-600" />} />
                </div>

                {/* User Management Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Students List */}
                        <UserList title="Students" users={students} />
                        {/* Lecturers List */}
                        <UserList title="Lecturers" users={lecturers} />
                    </div>

                    {/* Add User Form */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-fit">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-900">Add New User</h2>
                        </div>
                        <div className="p-6">
                            <form action={async (formData) => {
                                "use server";
                                await createUser(formData, schoolId);
                            }} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input name="fullName" type="text" required className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input name="email" type="email" required className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select name="role" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-primary">
                                        <option value="STUDENT">Student</option>
                                        <option value="LECTURER">Lecturer</option>
                                        <option value="STAFF">Staff</option>
                                    </select>
                                </div>
                                <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition">Create User</button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function StatCard({ title, value, icon }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-gray-50 rounded-xl">{icon}</div>
            <div>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                <p className="text-gray-500 text-sm">{title}</p>
            </div>
        </div>
    )
}

function UserList({ title, users }: any) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100"><h2 className="font-semibold text-gray-900">{title}</h2></div>
            <div className="divide-y divide-gray-50">
                {users.length === 0 ? <div className="p-6 text-gray-500 text-sm">No {title.toLowerCase()} found.</div> :
                    users.slice(0, 5).map((user: any) => (
                        <div key={user.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                            <div>
                                <p className="font-medium text-gray-900">{user.fullName}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{user.role}</span>
                        </div>
                    ))}
            </div>
        </div>
    )
}
