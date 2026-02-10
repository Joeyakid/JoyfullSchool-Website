import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ message: 'UserId required' }, { status: 400 });

    const courses = mockDB.getCourses(userId);
    const totalStudents = courses.reduce((acc, c) => acc + c.studentCount, 0);
    const assignments = mockDB.getAssignments(userId);

    return NextResponse.json({
        totalCourses: courses.length,
        totalStudents,
        activeAssignments: assignments.length,
        pendingMarking: Math.floor(Math.random() * 10) // mock
    });
}
