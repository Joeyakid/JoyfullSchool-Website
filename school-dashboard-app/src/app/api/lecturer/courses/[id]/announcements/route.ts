import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function GET(
  request: Request,
  context: { params: any }
) {
  const { id } = await context.params;

  // Filter student announcements by courseId
  // @ts-ignore
  const announcements = mockDB.getStudentAnnouncements().filter(a => a.courseId === id);
  return NextResponse.json(announcements);
}

export async function POST(
  request: Request,
  context: { params: any }
) {
  const { id } = await context.params;

  const body = await request.json();
  const { title, content, author } = body;

  if (!title || !content) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const newAnnouncement = {
    id: `ca${Math.random().toString(36).substring(2, 9)}`,
    title,
    content,
    date: new Date().toISOString().split("T")[0],
    author: author || "Lecturer",
    courseId: id,
  };

  mockDB.addStudentAnnouncement(newAnnouncement);
  return NextResponse.json(newAnnouncement);
}

export async function DELETE(
  request: Request,
  context: { params: any }
) {
  const { id } = await context.params;

  const { searchParams } = new URL(request.url);
  const announcementId = searchParams.get("id");

  if (!announcementId) {
    return NextResponse.json(
      { message: "Announcement ID required" },
      { status: 400 }
    );
  }

  mockDB.deleteStudentAnnouncement(announcementId);

  return NextResponse.json({
    message: "Deleted",
    courseId: id,
  });
}
