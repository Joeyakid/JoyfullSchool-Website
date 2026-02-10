'use client';

import { useState, useEffect } from 'react';
import DashboardSection from '@/components/staff/DashboardSection';
import { CheckSquare, Clock, AlertCircle } from 'lucide-react';

export default function StaffTasks() {
    const [tasks, setTasks] = useState<any[]>([]);

    const fetchTasks = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const { id } = JSON.parse(storedUser);
            fetch(`/api/staff/tasks?userId=${id}`)
                .then(res => res.json())
                .then(data => setTasks(data));
        }
    };

    useEffect(() => { fetchTasks(); }, []);

    const handleStatusUpdate = async (taskId: string, newStatus: string) => {
        await fetch('/api/staff/tasks', {
            method: 'PUT',
            body: JSON.stringify({ taskId, status: newStatus })
        });
        fetchTasks();
    };

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'high': return 'bg-red-100 text-red-700';
            case 'medium': return 'bg-orange-100 text-orange-700';
            default: return 'bg-blue-100 text-blue-700';
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Tasks</h1>

            <div className="grid grid-cols-1 gap-4">
                {tasks.map(task => (
                    <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${task.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                <CheckSquare className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className={`text-lg font-bold ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{task.title}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium uppercase ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Due: {task.dueDate}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {task.status !== 'completed' && (
                                <button
                                    onClick={() => handleStatusUpdate(task.id, 'completed')}
                                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Mark Complete
                                </button>
                            )}
                            <select
                                value={task.status}
                                onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
                                className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2"
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>
                ))}
                {tasks.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl text-gray-500 border border-dashed">
                        No tasks assigned to you currently.
                    </div>
                )}
            </div>
        </div>
    );
}
