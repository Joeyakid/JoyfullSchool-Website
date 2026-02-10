import Link from 'next/link';

interface RoleCardProps {
    role: string;
    description: string;
    icon: React.ReactNode;
    href: string;
}

export default function RoleCard({ role, description, icon, href }: RoleCardProps) {
    return (
        <Link
            href={href}
            className="group block p-6 bg-surface rounded-xl border border-border-soft hover:border-primary/50 hover:shadow-md transition-all duration-300"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-slate-50 rounded-lg text-primary group-hover:bg-primary/10 transition-colors">
                    {icon}
                </div>
                <svg
                    className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-text-main mb-2">{role}</h3>
            <p className="text-text-muted text-sm leading-relaxed">
                {description}
            </p>
        </Link>
    );
}
