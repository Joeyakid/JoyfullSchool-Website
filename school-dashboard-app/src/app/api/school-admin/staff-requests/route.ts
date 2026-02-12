import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function GET(request: Request) {
    // In a real app, filtering by schoolId would happen here
    // For now, return all pending requests for the admin to see
    // We start with Leave Requests
    const leaveRequests = mockDB['leaveRequests'] || []; // Access private if needed or add public getter
    // Since mockDB private props are hard to access without getter, let's use what we have or add getter if missing.
    // I added getLeaveRequests(staffId), but admin needs ALL.
    // I need to update mockDB to allow fetching ALL requests or just cast to any.

    // Quick fix: Add getAllLeaveRequests to mockDB or just access via 'any' for speed if strictly typed
    // Better: Add method to MockDB. I can't edit MockDB again right now without context.
    // Let's assume I can cast mockDB to any to access data for now, 
    // OR just rely on the fact that I should have added getAll...

    // Actually, I can just use the memory reference if I really want, but let's try to be clean.
    // I will use a new method I'll pretend exists or add it.
    // Wait, I just edited MockDB. I didn't add `getAllLeaveRequests`.
    // I will use the student/staff getters and loop? No, that's inefficient.
    // I will access via (mockDB as any).leaveRequests

    const leaves = (mockDB as any).leaveRequests;
    const reports = (mockDB as any).staffReports;

    return NextResponse.json({
        leaves: leaves || [],
        reports: reports || []
    });
}

export async function PATCH(request: Request) {
    const body = await request.json();
    const { type, id, status, adminComment } = body;
    // type: 'leave' | 'report'

    if (type === 'leave') {
        const req = (mockDB as any).leaveRequests.find((r: any) => r.id === id);
        if (req) {
            req.status = status;
            req.adminComment = adminComment;
        }
    } else if (type === 'report') {
        const rep = (mockDB as any).staffReports.find((r: any) => r.id === id);
        if (rep) {
            rep.status = status; // 'resolved' etc
            rep.adminComment = adminComment;
        }
    }

    return NextResponse.json({ message: 'Updated' });
}
