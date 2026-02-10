import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

const generateId = () => Math.random().toString(36).substring(2, 9);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    if (!courseId) return NextResponse.json({ message: 'CourseId required' }, { status: 400 });

    const results = mockDB.getResults(courseId);
    return NextResponse.json(results);
}

export async function POST(request: Request) {
    const body = await request.json();
    const newResult = mockDB.addResult({
        id: `r-${generateId()}`,
        ...body
    });
    return NextResponse.json(newResult);
}
