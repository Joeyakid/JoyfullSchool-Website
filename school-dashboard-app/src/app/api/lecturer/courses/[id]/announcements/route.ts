import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const announcements = mockDB.getAnnouncements(params.id);
    return NextResponse.json(announcements);
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const body = await request.json();
    const { title, content, author } = body;

    if (!title || !content) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newAnnouncement = {
        id: `ca${Math.random().toString(36).substr(2, 9)}`,
        title,
        content,
        date: new Date().toISOString().split('T')[0],
        author: author || 'Lecturer',
        courseId: params.id
    };

    mockDB.addStudentAnnouncement(newAnnouncement);
    return NextResponse.json(newAnnouncement);
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { searchParams } = new URL(request.url);
    const announcementId = searchParams.get('id');

    if (!announcementId) {
        return NextResponse.json(
            { message: "Announcement ID required" },
            { status: 400 }
        );
    }

    mockDB.deleteStudentAnnouncement(announcementId);

    return NextResponse.json({
        message: "Deleted",
        courseId: params.id
    });
}


// export async function DELETE(request: Request) {
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get('id');
//     if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });

//     mockDB.deleteStudentAnnouncement(id);
//     return NextResponse.json({ message: "Deleted" });
// }
