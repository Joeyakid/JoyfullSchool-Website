import { PrismaClient } from '../src/generated/client/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding database...');

    // Create 3 Schools
    const schoolsData = [
        { name: 'Springfield High', address: '742 Evergreen Terrace' },
        { name: 'Xavier Institute', address: '1407 Graymalkin Lane' },
        { name: 'Hogwarts', address: 'Unknown Location' },
    ];

    for (const schoolData of schoolsData) {
        const school = await prisma.school.create({
            data: {
                name: schoolData.name,
                address: schoolData.address,
                isActive: true,
            },
        });
        console.log(`Created school: ${school.name} with ID: ${school.id}`);

        // Create Admin for this school
        await prisma.user.create({
            data: {
                email: `admin@${school.name.replace(/\s+/g, '').toLowerCase()}.com`,
                username: `admin_${school.name.replace(/\s+/g, '').toLowerCase()}`,
                password: 'password123',
                fullName: `${school.name} Admin`,
                role: 'SCHOOL_ADMIN',
                schoolId: school.id,
            },
        });

        // Create a Lecturer
        const lecturer = await prisma.user.create({
            data: {
                email: `lecturer@${school.name.replace(/\s+/g, '').toLowerCase()}.com`,
                username: `lecturer_${school.name.replace(/\s+/g, '').toLowerCase()}`,
                password: 'password123',
                fullName: 'John Doe',
                role: 'LECTURER',
                schoolId: school.id,
            }
        });

        // Create a Course
        const course = await prisma.course.create({
            data: {
                title: 'Intro to Magic',
                code: 'MGC101',
                schoolId: school.id,
                teacherId: lecturer.id
            }
        });

        // Create a Student
        const student = await prisma.user.create({
            data: {
                email: `student@${school.name.replace(/\s+/g, '').toLowerCase()}.com`,
                username: `student_${school.name.replace(/\s+/g, '').toLowerCase()}`,
                password: 'password123',
                fullName: 'Harry Potter',
                role: 'STUDENT',
                schoolId: school.id,
            }
        });

        // Enroll Student
        await prisma.enrollment.create({
            data: {
                studentId: student.id,
                courseId: course.id
            }
        })
    }

    // Create Super Admin
    await prisma.user.create({
        data: {
            email: 'superadmin@platform.com',
            password: 'password123',
            fullName: 'Super Admin',
            role: 'SUPER_ADMIN',
        },
    });

    console.log('Seeding completed.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
