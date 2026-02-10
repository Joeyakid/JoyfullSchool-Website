import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function POST(request: Request) {
    const { postId, content, authorId, authorName, authorRole } = await request.json();
    const comment = mockDB.addForumComment({
        id: `com-${Date.now()}`,
        postId,
        content,
        authorId,
        authorName,
        authorRole,
        createdAt: new Date().toISOString()
    });
    return NextResponse.json(comment);
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) return NextResponse.json([]);
    return NextResponse.json(mockDB.getForumComments(postId));
}
