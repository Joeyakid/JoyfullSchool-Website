import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function GET() {
    // Fetch all students and courses for the admin dropdowns
    const students = mockDB.getUsersByRole('student').map(s => ({
        id: s.id,
        name: `${s.profile.firstName} ${s.profile.lastName} (${s.profile.matricNo || 'No Matric'})`
    }));

    // We need to access courses. MockDB doesn't have a public 'getAllCourses' but we have getCourses(lecturerId).
    // We need a way to get ALL courses.
    // I'll add getAllCourses to MockDB.
    const courses = mockDB.getAllCourses().map(c => ({
        id: c.id,
        code: c.code,
        title: c.title
    }));

    return NextResponse.json({ students, courses });
}
