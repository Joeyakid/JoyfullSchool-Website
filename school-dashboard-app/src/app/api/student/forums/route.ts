import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const enrolledCourses = mockDB.getStudentEnrollments(userId);
    const courseIds = enrolledCourses.map(e => e.courseId);

    // Need a way to get all posts filtered by course
    const allPosts = mockDB.getAllForumPosts(); // Need to implement this
    const relevantPosts = allPosts.filter(p => courseIds.includes(p.courseId));

    return NextResponse.json(relevantPosts);
}
