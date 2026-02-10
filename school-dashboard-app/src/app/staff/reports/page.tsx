'use client';

import { useState, useEffect } from 'react';
import { FileText, Plus, AlertTriangle, Wrench } from 'lucide-react';

export default function StaffReports() {
    const [reports, setReports] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newReport, setNewReport] = useState({ title: '', description: '', type: 'incident' });

    const fetchReports = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const { id } = JSON.parse(storedUser);
            fetch(`/api/staff/reports?userId=${id}`)
                .then(res => res.json())
                .then(data => setReports(data));
        }
    };

    useEffect(() => { fetchReports(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;
        const { id } = JSON.parse(storedUser); // Fixed variable name

        await fetch('/api/staff/reports', {
            method: 'POST',
            body: JSON.stringify({ userId: id, ...newReport })
        });
        setShowModal(false);
        setNewReport({ title: '', description: '', type: 'incident' });
        fetchReports();
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'incident': return <AlertTriangle className="w-5 h-5 text-red-600" />;
            case 'maintenance': return <Wrench className="w-5 h-5 text-orange-600" />;
            default: return <FileText className="w-5 h-5 text-blue-600" />;
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Reports Log</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> New Report
                </button>
            </div>

            <div className="space-y-4">
                {reports.map(report => (
                    <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                {getTypeIcon(report.type)}
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-bold text-gray-900 capitalize">{report.title}</h3>
                                <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${report.status === 'resolved' ? 'bg-green-100 text-green-700' :
                                        report.status === 'reviewer' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                                    }`}>{report.status}</span>
                            </div>
                            <p className="text-gray-600 mt-1 mb-2">{report.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="capitalize font-medium bg-gray-50 px-2 py-0.5 rounded border border-gray-200">{report.type}</span>
                                <span>Submitted: {report.date}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {reports.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl text-gray-500 border border-dashed">
                        No reports submitted yet.
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">Submit New Report</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select className="w-full border rounded-lg p-2" value={newReport.type} onChange={e => setNewReport({ ...newReport, type: e.target.value })}>
                                    <option value="incident">Incident</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="operational">Operational</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input type="text" required className="w-full border rounded-lg p-2" value={newReport.title} onChange={e => setNewReport({ ...newReport, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea className="w-full border rounded-lg p-2" rows={4} required value={newReport.description} onChange={e => setNewReport({ ...newReport, description: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
