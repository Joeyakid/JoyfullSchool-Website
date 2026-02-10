import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ message: 'UserId required' }, { status: 400 });

    const user = mockDB.findUserById(userId);
    if (!user || user.role !== 'lecturer') {
        return NextResponse.json({ message: 'Lecturer not found' }, { status: 404 });
    }

    // Enrich profile with dynamic stats if needed, or just return profile
    return NextResponse.json(user.profile);
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { userId, ...updates } = body;
        if (!userId) return NextResponse.json({ message: 'UserId required' }, { status: 400 });

        const updatedUser = mockDB.updateUser(userId, updates);
        if (!updatedUser) return NextResponse.json({ message: 'User not found' }, { status: 404 });

        return NextResponse.json({ message: 'Profile updated', profile: updatedUser.profile });
    } catch (e) {
        return NextResponse.json({ message: 'Error' }, { status: 500 });
    }
}
