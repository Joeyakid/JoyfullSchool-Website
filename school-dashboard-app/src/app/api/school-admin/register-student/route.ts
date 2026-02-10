import { NextResponse } from 'next/server';
import { mockDB, User } from '@/lib/mock-db';
import { nanoid } from 'nanoid';

// Polyfill nanoid if not available or just use simple random string
const generateId = () => Math.random().toString(36).substring(2, 15);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { firstName, lastName, email, password } = body;

        if (!email || !password || !firstName || !lastName) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }

        const existingUser = mockDB.findUserByEmail(email);
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 409 });
        }

        const newUser: User = {
            id: `student-${generateId()}`,
            email,
            password,
            role: 'student',
            profile: {
                firstName,
                lastName,
                matricNo: `CSC${new Date().getFullYear()}${Math.floor(Math.random() * 1000)}`, // Random Matric
                program: 'B.Sc Computer Science',
                level: '100',
                semester: 'First',
                avatarUrl: null
            }
        };

        mockDB.createUser(newUser);

        return NextResponse.json({ message: 'Student registered successfully', student: newUser });

    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
