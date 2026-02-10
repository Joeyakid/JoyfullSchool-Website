import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function GET() {
    const announcements = mockDB.getStudentAnnouncements();
    return NextResponse.json(announcements);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { title, content, author } = body;

    if (!title || !content) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newAnnouncement = {
        id: `sa${Math.random().toString(36).substr(2, 9)}`,
        title,
        content,
        date: new Date().toISOString().split('T')[0],
        author: author || 'Admin'
    };

    mockDB.addStudentAnnouncement(newAnnouncement);
    return NextResponse.json(newAnnouncement);
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ message: "Announcement ID required" }, { status: 400 });
    }

    mockDB.deleteStudentAnnouncement(id);
    return NextResponse.json({ message: "Announcement deleted successfully" });
}
