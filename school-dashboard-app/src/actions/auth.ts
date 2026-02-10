'use server';

import { db } from "@/lib/db";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SECRET_KEY = process.env.JWT_SECRET || "secret-key-change-me";
const key = new TextEncoder().encode(SECRET_KEY);

export async function login(formData: FormData) {
    const identifier = formData.get("identifier") as string; // Username or Email
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;
    // role context from form
    const roleLower = role ? role.toLowerCase() : 'student';

    if (!identifier || !password) {
        redirect(`/${roleLower}/login?error=Required fields`);
    }

    // Find user by Email OR Username
    // Note: We might want to filter by role too to prevent a Student logging in as Admin?
    // For now, let's find the user first.
    const user = await db.user.findFirst({
        where: {
            OR: [
                { email: identifier },
                { username: identifier }
            ]
        },
        include: { school: true }
    });

    if (!user || user.password !== password) {
        redirect(`/${roleLower}/login?error=Invalid credentials`);
    }

    // Optional: Enforce role match?
    // If a user tries to login to /admin/login but is a STUDENT, should we allow?
    // The user requirement says "Login should redirect to role-specific dashboard".
    // So we trust the DB role and redirect accordingly, regardless of where they logged in.
    // BUT, if they are a STUDENT logging in via ADMIN portal, it's a bit odd. 
    // Let's implement smart redirect based on the USER's actual role.

    // Create Session
    const sessionData = {
        userId: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        schoolId: user.schoolId,
    };

    const token = await new SignJWT(sessionData)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(key);

    (await cookies()).set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });

    // Smart Redirect based on DB Role
    if (user.role === 'SUPER_ADMIN') {
        redirect('/super-admin');
    } else if (user.role === 'SCHOOL_ADMIN') {
        // Redirect to their specific school admin dashboard
        redirect(`/${user.schoolId}/admin`);
    } else if (user.role === 'LECTURER') {
        redirect(`/${user.schoolId}/lecturer`);
    } else if (user.role === 'STUDENT') {
        redirect(`/${user.schoolId}/student`);
    } else if (user.role === 'STAFF') {
        // We don't have a staff dashboard yet, maybe /staff? Or just homepage.
        // Redirect to homepage for now with a query
        redirect('/?role=staff');
    } else {
        redirect('/');
    }
}

export async function logout() {
    (await cookies()).delete("session");
    redirect("/");
}

export async function getSession() {
    const session = (await cookies()).get("session")?.value;
    if (!session) return null;
    try {
        const { payload } = await jwtVerify(session, key, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (error) {
        return null;
    }
}
