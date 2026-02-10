import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET || "secret-key-change-me";
const key = new TextEncoder().encode(SECRET_KEY);

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    const { pathname } = request.nextUrl;

    // Define public paths
    const publicPaths = ['/', '/student/login', '/lecturer/login', '/staff/login', '/admin/login'];
    // Allow public assets
    if (pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname.includes('.')) {
        return NextResponse.next();
    }

    // Allow Access to Landing Page and ALL Login Pages
    // pathname.startsWith('/login') covers /login, /login/student, /login/student/forgot-password etc.
    if (pathname === '/' || pathname.startsWith('/login')) {
        return NextResponse.next();
    }

    // If no session, redirect to home (or a specific login choice page)
    if (!session) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    try {
        // Verify Session
        const { payload } = await jwtVerify(session, key, {
            algorithms: ["HS256"],
        });

        // Check Role Access
        // Super Admin Protection
        if (pathname.startsWith('/super-admin') && payload.role !== 'SUPER_ADMIN') {
            return NextResponse.redirect(new URL('/', request.url));
        }

        // School Admin Protection (Generic check)
        // In a real app we'd check if schoolId matches payload.schoolId
        // For now, simpler role check
        if (pathname.includes('/admin') && !pathname.startsWith('/super-admin') && payload.role !== 'SCHOOL_ADMIN') {
            return NextResponse.redirect(new URL('/', request.url));
        }

    } catch (error) {
        // Invalid token
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
