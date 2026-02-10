'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/school-admin/Sidebar';
import Overview from '@/components/school-admin/Overview';
import UserManagement from '@/components/school-admin/UserManagement';
import CourseManagement from '@/components/school-admin/CourseManagement';
import EnrollmentManagement from '@/components/school-admin/EnrollmentManagement';
import AnnouncementManagement from '@/components/school-admin/AnnouncementManagement';

export default function SchoolAdminDashboard() {
    const router = useRouter();
    const [activeView, setActiveView] = useState('overview');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        router.push('/login/school-admin');
    };

    const renderContent = () => {
        switch (activeView) {
            case 'overview': return <Overview />;
            case 'users': return <UserManagement />;
            case 'courses': return <CourseManagement />;
            case 'enrollments': return <EnrollmentManagement />;
            case 'announcements': return <AnnouncementManagement />;
            default: return <Overview />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <Sidebar
                activeView={activeView}
                setActiveView={setActiveView}
                onLogout={handleLogout}
            />

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 capitalize">
                            {activeView === 'overview' ? 'Dashboard Overview' :
                                activeView === 'users' ? 'User Management' :
                                    activeView.replace('-', ' ')}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Manage your school operations efficiently.</p>
                    </div>
                </header>

                {renderContent()}
            </main>
        </div>
    );
}

