'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, FileText, Briefcase, Send } from 'lucide-react';
import Swal from 'sweetalert2';

export default function StaffRequestsPage() {
    const [requests, setRequests] = useState<{ leaves: any[], reports: any[] }>({ leaves: [], reports: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'leaves' | 'reports' | 'assign'>('leaves');

    // For Task Assignment
    const [staffList, setStaffList] = useState<any[]>([]);
    const [taskForm, setTaskForm] = useState({ staffId: '', title: '', description: '', priority: 'medium', dueDate: '' });

    useEffect(() => {
        fetchRequests();
        fetchStaff();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/school-admin/staff-requests');
            if (res.ok) setRequests(await res.json());
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const fetchStaff = async () => {
        const res = await fetch('/api/school-admin/users?role=staff'); // Assuming this endpoint exists or similar
        if (res.ok) setStaffList(await res.json());
    };

    const handleUpdateStatus = async (type: 'leave' | 'report', id: string, status: string) => {
        const { value: comment } = await Swal.fire({
            title: `Confirm ${status}?`,
            input: 'text',
            inputPlaceholder: 'Optional comment...',
            showCancelButton: true
        });

        if (comment !== undefined) {
            const res = await fetch('/api/school-admin/staff-requests', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, id, status, adminComment: comment })
            });
            if (res.ok) {
                Swal.fire('Success', 'Status updated', 'success');
                fetchRequests();
            }
        }
    };

    const handleAssignTask = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/school-admin/assign-task', {
            method: 'POST',
            body: JSON.stringify(taskForm)
        });
        if (res.ok) {
            Swal.fire('Success', 'Task assigned', 'success');
            setTaskForm({ staffId: '', title: '', description: '', priority: 'medium', dueDate: '' });
        }
    };

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>

            <div className="flex gap-4 border-b border-gray-200">
                <button onClick={() => setActiveTab('leaves')} className={`pb-2 px-1 ${activeTab === 'leaves' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}>Leave Requests</button>
                <button onClick={() => setActiveTab('reports')} className={`pb-2 px-1 ${activeTab === 'reports' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}>Reports</button>
                <button onClick={() => setActiveTab('assign')} className={`pb-2 px-1 ${activeTab === 'assign' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}>Assign Task</button>
            </div>

            {loading ? <p>Loading...</p> : (
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    {activeTab === 'leaves' && (
                        <div className="space-y-4">
                            {requests.leaves.length === 0 ? <p className="text-gray-500">No pending leave requests.</p> : (
                                requests.leaves.map(r => (
                                    <div key={r.id} className="border p-4 rounded-lg flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${r.type === 'sick' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{r.type}</span>
                                                <h3 className="font-bold">{r.reason}</h3>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">{r.startDate} to {r.endDate}</p>
                                            <p className="text-xs text-gray-400 mt-1">Status: {r.status}</p>
                                        </div>
                                        {r.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <button onClick={() => handleUpdateStatus('leave', r.id, 'approved')} className="p-2 bg-green-50 text-green-600 rounded hover:bg-green-100"><CheckCircle size={18} /></button>
                                                <button onClick={() => handleUpdateStatus('leave', r.id, 'rejected')} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100"><XCircle size={18} /></button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'reports' && (
                        <div className="space-y-4">
                            {requests.reports.map(r => (
                                <div key={r.id} className="border p-4 rounded-lg flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-bold uppercase">{r.type}</span>
                                            <h3 className="font-bold">{r.title}</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{r.description}</p>
                                        <p className="text-xs text-gray-400 mt-1">{r.date} • {r.status}</p>
                                    </div>
                                    {r.status !== 'resolved' && (
                                        <button onClick={() => handleUpdateStatus('report', r.id, 'resolved')} className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100">Mark Resolved</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'assign' && (
                        <form onSubmit={handleAssignTask} className="max-w-md space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Staff Member</label>
                                <select required className="w-full mt-1 p-2 border rounded-lg" value={taskForm.staffId} onChange={e => setTaskForm({ ...taskForm, staffId: e.target.value })}>
                                    <option value="">Select Staff</option>
                                    {staffList.map(s => <option key={s.id} value={s.id}>{s.profile.firstName} {s.profile.lastName}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Task Title</label>
                                <input required className="w-full mt-1 p-2 border rounded-lg" value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea className="w-full mt-1 p-2 border rounded-lg" value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                                    <select className="w-full mt-1 p-2 border rounded-lg" value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                                    <input type="date" required className="w-full mt-1 p-2 border rounded-lg" value={taskForm.dueDate} onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2">
                                <Send size={18} /> Assign Task
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}
