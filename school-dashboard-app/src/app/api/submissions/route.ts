import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function POST(request: Request) {
    const data = await request.json();
    const { assignmentId, studentId, studentName, content, type } = data;

    if (!assignmentId || !studentId) {
        return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const submission = mockDB.addSubmission({
        id: `sub-${Date.now()}`,
        relatedId: assignmentId,
        studentId,
        studentName,
        content: content || 'File Uploaded',
        type: type || 'assignment',
        grade: null,
        status: 'submitted',
        submittedAt: new Date().toISOString()
    });

    return NextResponse.json(submission);
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get('assignmentId');
    const studentId = searchParams.get('studentId');

    if (studentId && assignmentId) {
        const sub = mockDB.getStudentSubmission(assignmentId, studentId);
        return NextResponse.json(sub || null);
    }

    if (assignmentId) {
        const subs = mockDB.getSubmissions(assignmentId);
        return NextResponse.json(subs);
    }

    return NextResponse.json([]);
}
