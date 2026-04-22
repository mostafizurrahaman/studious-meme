import { NextResponse, type NextRequest } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth/session';
import { getDashboardPathByRole, isAllowedDashboardPath } from '@/lib/auth/roles';

function redirectTo(request: NextRequest, pathname: string) {
    return NextResponse.redirect(new URL(pathname, request.url));
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const session = getAuthUserFromRequest(request);

    if (!session) {
        if (pathname === '/my-account') {
            return NextResponse.next();
        }

        return redirectTo(request, '/my-account');
    }

    if (pathname === '/my-account' || pathname.startsWith('/my-account/')) {
        return redirectTo(request, getDashboardPathByRole(session.role) ?? '/dashboard');
    }

    if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
        if (pathname === '/dashboard') {
            return redirectTo(request, getDashboardPathByRole(session.role) ?? '/dashboard');
        }

        if (!isAllowedDashboardPath(session.role, pathname)) {
            return redirectTo(request, getDashboardPathByRole(session.role) ?? '/dashboard');
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/my-account/:path*'],
};
