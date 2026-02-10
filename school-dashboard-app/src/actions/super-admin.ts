'use server';

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getPlatformStats() {
    const totalSchools = await db.school.count();
    const activeSchools = await db.school.count({ where: { isActive: true } });
    const totalUsers = await db.user.count();

    return {
        totalSchools,
        activeSchools,
        totalUsers,
    };
}

export async function getSchools() {
    return await db.school.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { users: true }
            }
        }
    });
}

export async function createSchool(formData: FormData) {
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;

    if (!name) throw new Error("Name is required");

    await db.school.create({
        data: {
            name,
            address,
            isActive: true, // Default to active
        },
    });

    revalidatePath('/super-admin');
}

export async function toggleSchoolStatus(schoolId: string, isActive: boolean) {
    await db.school.update({
        where: { id: schoolId },
        data: { isActive }
    });
    revalidatePath('/super-admin');
}
