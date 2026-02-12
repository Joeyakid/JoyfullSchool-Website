import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';

export async function GET(request: Request) {
    const surveys = mockDB.getSurveys();
    return NextResponse.json(surveys);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { surveyId, voterId, choice } = body;

    if (!surveyId || !voterId || !choice) {
        return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    // Check if already voted? MockDB doesn't strictly enforce yet, but let's do cursory check
    const existing = mockDB.getVotes(surveyId).find(v => v.voterId === voterId);
    if (existing) {
        return NextResponse.json({ message: 'Already voted' }, { status: 403 });
    }

    const vote = mockDB.castVote({
        id: `v-${Date.now()}`,
        surveyId,
        voterId,
        choice
    });

    return NextResponse.json(vote);
}
