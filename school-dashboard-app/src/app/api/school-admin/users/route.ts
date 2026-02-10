import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    if (role) {
        const users = mockDB.getUsersByRole(role);
        return NextResponse.json(users);
    }

    return NextResponse.json({ message: "Role required" }, { status: 400 });
}

export async function PUT(request: Request) {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
        return NextResponse.json({ message: "User ID required" }, { status: 400 });
    }

    const updatedUser = mockDB.updateUser(id, updates);
    if (!updatedUser) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated successfully", user: updatedUser });
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ message: "User ID required" }, { status: 400 });
    }

    mockDB.deleteUser(id);
    return NextResponse.json({ message: "User terminated successfully" });
}
