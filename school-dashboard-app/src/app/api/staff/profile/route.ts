import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ message: 'UserId required' }, { status: 400 });

    const user = mockDB.findUserById(userId);
    if (!user || user.role !== 'staff') {
        return NextResponse.json({ message: 'Staff not found' }, { status: 404 });
    }

    // Mock Salary Info (Hardcoded for now as it wasn't in DB schema yet)
    const salaryInfo = {
        basic: 150000,
        allowances: 20000,
        tax: 15000,
        net: 155000,
        status: 'Paid',
        paymentDate: '2026-01-28'
    };

    return NextResponse.json({ ...user.profile, salary: salaryInfo });
}

export async function PUT(request: Request) {
    // Re-use logic or implement specific fields
    return NextResponse.json({ message: 'Not implemented' });
}
