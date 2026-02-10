import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DashboardSectionProps {
    title: string;
    children: ReactNode;
    className?: string;
    icon?: React.ElementType;
}

export default function DashboardSection({ title, children, className, icon: Icon }: DashboardSectionProps) {
    return (
        <div className={cn("mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500", className)}>
            {/* Ribbon Header - Green Theme */}
            <div className="relative mb-4">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-600 rounded-l-md"></div>
                <div className="bg-gradient-to-r from-green-700 to-green-600 text-white py-2 px-4 rounded-r-md inline-flex items-center gap-2 shadow-sm font-semibold text-sm tracking-wide uppercase">
                    {Icon && <Icon className="w-4 h-4 opacity-90" />}
                    {title}
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                {children}
            </div>
        </div>
    );
}
