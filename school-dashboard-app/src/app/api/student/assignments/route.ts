import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // 1. Get enrolled course IDs
    const enrolledCourses = mockDB.getStudentEnrollments(userId);
    const courseIds = enrolledCourses.map(e => e.courseId);

    // 2. Fetch assignments for these courses
    // MockDB doesn't have a direct 'getAssignmentsByCourseId' but we can iterate or filter
    // Let's add a helper in mockDB or just filter all assignments here (since it's mock)
    // Accessing private 'assignments' array is tricky if not exposed.
    // Best to add a method to MockDB associated with this task.

    // For now, let's assume we can filter if we expose a getter or access via 'getAssignments' which takes lecturerId.
    // We need 'getAssignmentsByCourse' on MockDB. 

    // WORKAROUND: We will update MockDB to expose this.
    // For this step, I will write the logic assuming the method exists, then update MockDB next.

    const allAssignments = mockDB.getAllAssignments(); // Need to implement this
    const relevantAssignments = allAssignments.filter(a => courseIds.includes(a.courseId));

    return NextResponse.json(relevantAssignments);
}
