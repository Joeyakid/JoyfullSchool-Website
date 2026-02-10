import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { mockDB } from '@/lib/mock-db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, role } = body;

        // Use centralized Mock DB
        const user = mockDB.findUserByEmail(email);

        if (!user || user.password !== password || user.role !== role) {
            return NextResponse.json(
                { message: 'Invalid credentials or role mismatch' },
                { status: 401 }
            );
        }

        // Generate mock token (JWT) for Middleware compatibility
        const SECRET_KEY = process.env.JWT_SECRET || "secret-key-change-me";
        const key = new TextEncoder().encode(SECRET_KEY);

        // Create Session Payload for Middleware
        // Ensure roles match what middleware expects if needed, or update middleware to be more lenient.
        // Middleware checks: payload.role === 'SUPER_ADMIN' or 'SCHOOL_ADMIN' etc.
        // My mock roles are 'student', 'lecturer', 'staff', 'school-admin'.
        // Existing middleware handling is case sensitive probably.
        // Let's create a compatible role string.
        let jwtRole = user.role.toUpperCase().replace('-', '_'); // e.g. SCHOOL_ADMIN


        const sessionData = {
            userId: user.id,
            email: user.email,
            username: `${user.profile.firstName} ${user.profile.lastName}`,
            role: jwtRole,
            schoolId: 'mock-school-id',
        };

        const token = await new SignJWT(sessionData)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(key);

        const response = NextResponse.json({
            message: 'Login successful',
            token: token,
            role: user.role,
            user: {
                id: user.id,
                name: `${user.profile.firstName} ${user.profile.lastName}`,
                email: user.email,
                avatarUrl: user.profile.avatarUrl
            }
        });

        // Set Cookie for Middleware
        response.cookies.set("session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        return response;

    } catch (error) {
        console.error("Login API Error:", error);
        return NextResponse.json(
            { message: 'Server error processing request' },
            { status: 500 }
        );
    }
}
