import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const protectedRoutes = ['/dashboard', '/profile', '/admin', '/book'];

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // Check if the path starts with any protected route
    const isProtected = protectedRoutes.some(route =>
        pathname.startsWith(route)
    );

    // If route is not protected, continue as normal
    if (!isProtected) {
        return NextResponse.next();
    }

    const token = request.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET)
        );
        return NextResponse.next();
    } catch (err) {
        console.error('[Middleware] Invalid token:', err.message);
        return NextResponse.redirect(new URL('/login', request.url));
    }
}
