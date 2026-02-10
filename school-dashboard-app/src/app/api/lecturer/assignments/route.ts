import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

const generateId = () => Math.random().toString(36).substring(2, 9);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ message: 'UserId required' }, { status: 400 });

    const assignments = mockDB.getAssignments(userId);
    return NextResponse.json(assignments);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { userId, ...data } = body;

    if (!userId) return NextResponse.json({ message: 'UserId required' }, { status: 400 });

    const newAssignment = mockDB.addAssignment({
        id: `a-${generateId()}`,
        lecturerId: userId,
        ...data
    });

    return NextResponse.json(newAssignment);
}
