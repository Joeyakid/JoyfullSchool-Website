import {
    LayoutDashboard,
    Users,
    BookOpen,
    GraduationCap,
    Bell,
    LogOut,
    School
} from 'lucide-react';

interface SidebarProps {
    activeView: string;
    setActiveView: (view: string) => void;
    onLogout: () => void;
}

export default function Sidebar({ activeView, setActiveView, onLogout }: SidebarProps) {
    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'courses', label: 'Courses', icon: BookOpen },
        { id: 'enrollments', label: 'Enrollments', icon: GraduationCap },
        { id: 'announcements', label: 'Announcements', icon: Bell },
    ];

    return (
        <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                    <School className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-gray-900 text-lg">School Admin</span>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeView === item.id
                                ? 'bg-orange-50 text-orange-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-orange-600' : 'text-gray-400'}`} />
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </div>
    );
}
