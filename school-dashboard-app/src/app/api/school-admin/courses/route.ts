import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function GET() {
    const courses = mockDB.getAllCourses();
    // Enrich with lecturer details
    const enrichedCourses = courses.map(c => {
        const lecturer = mockDB.findUserById(c.lecturerId);
        return {
            ...c,
            lecturerName: lecturer ? `${lecturer.profile.firstName} ${lecturer.profile.lastName}` : 'Unassigned'
        };
    });
    return NextResponse.json(enrichedCourses);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { code, title, description, semester, lecturerId } = body;

    if (!code || !title || !semester) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newCourse = {
        id: `c${Math.random().toString(36).substr(2, 9)}`,
        code,
        title,
        description: description || '',
        semester,
        lecturerId: lecturerId || '',
        studentCount: 0
    };

    mockDB.addCourse(newCourse);
    return NextResponse.json(newCourse);
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ message: "Course ID required" }, { status: 400 });
    }

    mockDB.deleteCourse(id);
    return NextResponse.json({ message: "Course deleted successfully" });
}
