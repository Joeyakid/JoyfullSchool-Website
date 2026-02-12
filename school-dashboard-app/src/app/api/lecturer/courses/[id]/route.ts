import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function GET(
    request: Request,
    context: { params: any }
) {
    const { id } = await context.params;
    const course = mockDB.getAllCourses().find(c => c.id === id);
    if (!course) {
        return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }
    return NextResponse.json(course);
}
