'use server';

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getSchoolStats(schoolId: string) {
    const school = await db.school.findUnique({ where: { id: schoolId } });
    if (!school) throw new Error("School not found");

    const totalStudents = await db.user.count({ where: { schoolId, role: 'STUDENT' } });
    const totalLecturers = await db.user.count({ where: { schoolId, role: 'LECTURER' } });
    const totalCourses = await db.course.count({ where: { schoolId } });

    return { school, totalStudents, totalLecturers, totalCourses };
}

export async function getUsers(schoolId: string, role?: 'STUDENT' | 'LECTURER' | 'STAFF') {
    return await db.user.findMany({
        where: { schoolId, role },
        orderBy: { createdAt: 'desc' }
    });
}

export async function createUser(formData: FormData, schoolId: string) {
    const email = formData.get('email') as string;
    const fullName = formData.get('fullName') as string;
    const role = formData.get('role') as 'STUDENT' | 'LECTURER' | 'STAFF';
    const password = 'password123'; // Default password for now

    if (!email || !fullName || !role) throw new Error("Missing fields");

    await db.user.create({
        data: {
            email,
            password,
            fullName,
            role,
            schoolId
        }
    });

    revalidatePath(`/${schoolId}/admin`);
}
