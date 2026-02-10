import { NextResponse } from 'next/server';
import { mockDB, User } from '@/lib/mock-db';

const generateId = () => Math.random().toString(36).substring(2, 11);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { firstName, lastName, email, password, department, phone } = body;

        if (!email || !password || !firstName || !lastName) {
            return NextResponse.json({ message: 'Required fields missing' }, { status: 400 });
        }

        const existingUser = mockDB.findUserByEmail(email);
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 409 });
        }

        const newStaff: User = {
            id: `staff-${generateId()}`,
            email,
            password,
            role: 'staff',
            profile: {
                firstName,
                lastName,
                department: department || 'General',
                phone: phone || '',
                avatarUrl: null
            }
        };

        mockDB.createUser(newStaff);
        return NextResponse.json({ message: 'Staff registered successfully', staff: newStaff });

    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
