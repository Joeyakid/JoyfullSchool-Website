import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function POST(request: Request) {
    const body = await request.json();
    const { staffId, title, description, priority, dueDate } = body;

    if (!staffId || !title) {
        return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const newTask = {
        id: `t-${Date.now()}`,
        staffId,
        title,
        description,
        priority: priority || 'medium',
        dueDate: dueDate || new Date().toISOString().split('T')[0],
        status: 'pending'
    };

    mockDB.addStaffTask(newTask as any); // Cast to suit type

    return NextResponse.json(newTask);
}
