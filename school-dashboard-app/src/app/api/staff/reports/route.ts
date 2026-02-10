import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

const generateId = () => Math.random().toString(36).substring(2, 9);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ message: 'UserId required' }, { status: 400 });

    const reports = mockDB.getStaffReports(userId);
    return NextResponse.json(reports);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { userId, ...data } = body;

    if (!userId) return NextResponse.json({ message: 'UserId required' }, { status: 400 });

    const newReport = mockDB.addStaffReport({
        id: `rep-${generateId()}`,
        staffId: userId,
        status: 'submitted',
        date: new Date().toISOString().split('T')[0],
        ...data
    });

    return NextResponse.json(newReport);
}
