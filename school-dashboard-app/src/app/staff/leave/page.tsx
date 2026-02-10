'use client';

import { useState, useEffect } from 'react';
import { CalendarDays, Plus } from 'lucide-react';

export default function StaffLeave() {
    const [leave, setLeave] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newLeave, setNewLeave] = useState({ type: 'casual', startDate: '', endDate: '', reason: '' });

    const fetchLeave = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const { id } = JSON.parse(storedUser);
            fetch(`/api/staff/leave?userId=${id}`)
                .then(res => res.json())
                .then(data => setLeave(data));
        }
    };

    useEffect(() => { fetchLeave(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;
        const { id } = JSON.parse(storedUser);

        await fetch('/api/staff/leave', {
            method: 'POST',
            body: JSON.stringify({ userId: id, ...newLeave })
        });
        setShowModal(false);
        setNewLeave({ type: 'casual', startDate: '', endDate: '', reason: '' });
        fetchLeave();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Request Leave
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Mock Leave Balances */}
                <div className="bg-teal-50 rounded-lg p-4 border border-teal-100">
                    <p className="text-sm font-semibold text-teal-700">Annual Leave</p>
                    <p className="text-2xl font-bold text-gray-900">15 <span className="text-sm font-normal text-gray-500">days left</span></p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <p className="text-sm font-semibold text-purple-700">Sick Leave</p>
                    <p className="text-2xl font-bold text-gray-900">10 <span className="text-sm font-normal text-gray-500">days left</span></p>
                </div>
            </div>

            <h2 className="font-bold text-gray-900 mb-4">Request History</h2>
            <div className="space-y-4">
                {leave.map(req => (
                    <div key={req.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-semibold text-gray-900 capitalize">{req.type} Leave</h3>
                                <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${req.status === 'approved' ? 'bg-green-100 text-green-700' :
                                        req.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                                    }`}>{req.status}</span>
                            </div>
                            <p className="text-sm text-gray-600">{req.reason}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                <CalendarDays className="w-3 h-3" />
                                <span>{req.startDate} to {req.endDate}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {leave.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl text-gray-500 border border-dashed">
                        No leave requests found.
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">Request Time Off</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                                <select className="w-full border rounded-lg p-2" value={newLeave.type} onChange={e => setNewLeave({ ...newLeave, type: e.target.value })}>
                                    <option value="casual">Casual / Annual</option>
                                    <option value="sick">Sick Leave</option>
                                    <option value="vacation">Vacation</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input type="date" required className="w-full border rounded-lg p-2" value={newLeave.startDate} onChange={e => setNewLeave({ ...newLeave, startDate: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                    <input type="date" required className="w-full border rounded-lg p-2" value={newLeave.endDate} onChange={e => setNewLeave({ ...newLeave, endDate: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                                <textarea className="w-full border rounded-lg p-2" rows={3} required value={newLeave.reason} onChange={e => setNewLeave({ ...newLeave, reason: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Submit Request</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
