import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ message: 'UserId required' }, { status: 400 });

    const tasks = mockDB.getStaffTasks(userId);
    const reports = mockDB.getStaffReports(userId);
    const leave = mockDB.getLeaveRequests(userId);

    return NextResponse.json({
        pendingTasks: tasks.filter(t => t.status !== 'completed').length,
        submittedReports: reports.length,
        pendingLeave: leave.filter(l => l.status === 'pending').length,
        leaveBalance: 15 // Mock balance
    });
}
