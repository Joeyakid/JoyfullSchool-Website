import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function POST(request: Request) {
    const { submissionId, grade } = await request.json();

    if (!submissionId || grade === undefined) {
        return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const updated = mockDB.gradeSubmission(submissionId, Number(grade));
    // Also update main Result if it's a final
    // For now we keep submission grades separate from Course Results

    return NextResponse.json(updated);
}
