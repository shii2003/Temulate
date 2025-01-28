import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'


export function middleware(request: NextRequest) {

    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get('accessToken')?.value;

    const unprotectedRoutes = ['/', '/login', '/signup'];
    const protectedRoutes = ['/menu', '/codeRooms'];

    if (accessToken) {
        if (unprotectedRoutes.includes(pathname)) {
            return NextResponse.redirect(new URL('/menu', request.url));
        }
    } else {
        if (protectedRoutes.includes(pathname)) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}


export const config = {
    matcher: ['/((?!_next/static|favicon.ico).*)'],
}