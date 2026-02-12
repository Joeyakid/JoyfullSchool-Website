import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function GET(
    request: Request,
    context: { params: any }
) {
    const { id } = await context.params;
    const posts = mockDB.getCourseForumPosts(id);
    return NextResponse.json(posts);
}

export async function POST(
    request: Request,
    context: { params: any }
) {
    const { id } = await context.params;
    const body = await request.json();
    const { title, content, authorName, authorId } = body;

    const newPost = {
        id: `fp${Math.random().toString(36).substr(2, 9)}`,
        courseId: id,
        authorId: authorId || 'lecturer',
        authorName: authorName || 'Lecturer',
        title,
        content,
        date: new Date().toISOString().split('T')[0]
    };

    mockDB.addForumPost(newPost);
    return NextResponse.json(newPost);
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });

    mockDB.deleteForumPost(id);
    return NextResponse.json({ message: "Deleted" });
}
