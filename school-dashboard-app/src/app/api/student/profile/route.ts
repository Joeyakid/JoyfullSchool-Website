import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ message: 'UserId required' }, { status: 400 });
    }

    const user = mockDB.findUserById(userId);
    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user.profile);
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { userId, ...updates } = body; // Expect userId in body for updates

        if (!userId) {
            return NextResponse.json({ message: 'UserId required' }, { status: 400 });
        }

        const updatedUser = mockDB.updateUser(userId, updates);
        if (!updatedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Profile updated', profile: updatedUser.profile });
    } catch (e) {
        return NextResponse.json({ message: 'Error updating profile' }, { status: 500 });
    }
}
