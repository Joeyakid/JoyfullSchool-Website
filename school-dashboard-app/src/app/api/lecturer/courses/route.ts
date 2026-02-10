import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';
import { nanoid } from 'nanoid';

const generateId = () => Math.random().toString(36).substring(2, 9);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ message: 'UserId required' }, { status: 400 });

    const courses = mockDB.getCourses(userId);
    return NextResponse.json(courses);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { userId, ...courseData } = body;

    if (!userId) return NextResponse.json({ message: 'UserId required' }, { status: 400 });

    const newCourse = mockDB.addCourse({
        id: `c-${generateId()}`,
        lecturerId: userId,
        studentCount: 0,
        ...courseData
    });

    return NextResponse.json(newCourse);
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    if (!courseId) return NextResponse.json({ message: 'CourseId required' }, { status: 400 });

    mockDB.deleteCourse(courseId);
    return NextResponse.json({ message: 'Deleted' });
}
