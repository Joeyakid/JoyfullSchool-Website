import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) return NextResponse.json({ message: 'UserId required' }, { status: 400 });

  const data = mockDB.getStudentData(userId);
  return NextResponse.json(data.summary);
}
