import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    const courseId = params.id;

    // 1. Get Enrollments
    // We need to fetch students who are enrolled in this course
    const enrollments = mockDB.getCourseStudents(courseId);

    // 2. Hydrate with User Data
    const students = enrollments.map(e => {
        const u = mockDB.findUserById(e.studentId);
        return u ? { id: u.id, profile: u.profile } : null;
    }).filter(Boolean);

    // 3. Get Existing Results
    // Should filtering by 'type' be necessary? Maybe just get all for now, or assume 'exam' type
    const courseResults = mockDB.getResults(courseId).filter(r => r.type === 'exam');

    return NextResponse.json({
        students,
        results: courseResults
    });
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    const courseId = params.id;
    const { results } = await request.json(); // Array of { studentId, score }

    if (!Array.isArray(results)) {
        return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }

    results.forEach((r: any) => {
        // Simple upsert logic
        // In real DB use upsert. Here we find and update or push.
        // NOTE: mockDB methods usually just push new. We need to be careful not to dupe.
        // For simplicity, let's just 'addResult' which just pushes. 
        // We really should clean old results for this student/course/type first or update them.

        // Since mockDB array is accessible, we can filter out old ones?
        // Or update MockDB to support updateResult.
        // Let's rely on MockDB update method logic or similar.

        // Actually, let's just use a custom implementation here for the MockDB knowing its internal structure is exposed via import (singleton).
        // But better practice is to add a method to MockDB.
        // For expediency, I'll filter out old results for this student/course in this specific controller if MockDB doesn't allow update.

        // Let's add 'upsertResult' to MockDB in my head/usage pattern:
        // Delete old result -> Add new result
        // mockDB.deleteResult(...) (Does not exist)

        // Let's just Add and ignore duplicates for now or fix mockDB.
        // I'll assume addResult is fine for MVP, but UI might duplicate if refreshed.
        // Check if exists:
        const existing = mockDB.getResults(courseId).find(res => res.studentId === r.studentId && res.type === 'exam');
        if (existing) {
            existing.score = r.score;
        } else {
            mockDB.addResult({
                id: `res-${Date.now()}-${Math.random()}`,
                courseId,
                studentId: r.studentId,
                studentName: 'Student', // Lookup real name if needed
                score: r.score,
                total: 100,
                type: 'exam'
            });
        }
    });

    return NextResponse.json({ message: 'Saved' });
}
