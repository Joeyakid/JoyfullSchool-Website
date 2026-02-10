'use client';

import { useEffect, useState } from 'react';
import { Video, Calendar, ExternalLink } from 'lucide-react';

export default function StudentClasses() {
    const [classes, setClasses] = useState<any[]>([]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const { id } = JSON.parse(storedUser);
            fetch(`/api/student/classes?userId=${id}`)
                .then(res => res.json())
                .then(data => setClasses(data));
        }
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Online Classes</h1>

            <div className="space-y-4">
                {classes.map((cls) => (
                    <div key={cls.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${cls.status === 'Live' ? 'bg-red-100 animate-pulse' : 'bg-gray-100'
                                }`}>
                                <Video className={`w-6 h-6 ${cls.status === 'Live' ? 'text-red-600' : 'text-gray-500'}`} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    {cls.title}
                                    {cls.status === 'Live' && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Live</span>}
                                </h3>
                                <p className="text-gray-600 text-sm flex items-center gap-1.5 mt-1">
                                    <span className="font-medium text-blue-600">{cls.course}</span> •
                                    <Calendar className="w-3.5 h-3.5" /> {cls.time}
                                </p>
                            </div>
                        </div>

                        <a
                            href={cls.link}
                            target="_blank"
                            className={`px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${cls.status === 'Live'
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                            onClick={(e) => cls.status !== 'Live' && e.preventDefault()}
                        >
                            Join Class <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
