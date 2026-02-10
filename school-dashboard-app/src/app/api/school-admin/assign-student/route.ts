import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { studentId, courseId, semester } = body;

        if (!studentId || !courseId) {
            return NextResponse.json({ message: 'Student ID and Course ID are required' }, { status: 400 });
        }

        const enrollment = mockDB.enrollStudent(studentId, courseId, semester || 'Current');

        return NextResponse.json({ message: 'Enrollment successful', enrollment });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
