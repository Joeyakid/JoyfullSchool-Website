'use server';

import { db } from "@/lib/db";

export async function getStudentData(studentId: string) {
    // In a real app we'd get the ID from the session. For MVP, we might need a workaround or assume the page context provides enough info.
    // However, the page is /student/, so we really need a login context.
    // Since Auth isn't built, we might just fetch *a* student for the given school to demo.
    return {
        enrollments: [] // database fetch logic here
    }
}

export async function getLecturerCourses(lecturerId: string) {
    return await db.course.findMany({
        where: { teacherId: lecturerId },
        include: { _count: { select: { enrollments: true } } }
    });
}
