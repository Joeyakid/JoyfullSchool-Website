import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const course = mockDB.getAllCourses().find(c => c.id === params.id);
    if (!course) {
        return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }
    return NextResponse.json(course);
}
