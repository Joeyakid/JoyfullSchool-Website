import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';
import { nanoid } from 'nanoid';

const generateId = () => Math.random().toString(36).substring(2, 9);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ message: 'UserId required' }, { status: 400 });

    const tasks = mockDB.getStaffTasks(userId);
    return NextResponse.json(tasks);
}

export async function PUT(request: Request) {
    const body = await request.json();
    const { taskId, status } = body;
    if (!taskId) return NextResponse.json({ message: 'TaskId required' }, { status: 400 });

    const updated = mockDB.updateStaffTask(taskId, { status });
    return NextResponse.json(updated);
}
