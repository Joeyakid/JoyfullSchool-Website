import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function GET(request: Request) {
    const announcements = mockDB.getAnnouncements();
    return NextResponse.json(announcements);
}
