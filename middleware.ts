import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { AUTH_ROUTE, BASE_URL, PUBLIC_ROUTES } from "./constants/routes";
import { cookies } from "next/headers";
import { verify } from "./actions/sessions";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    const cookieStore = await cookies();
    const cookie = cookieStore.get("session")?.value;
    const session = await verify(cookie);

    if (!isPublicRoute && !session) {
        return NextResponse.redirect(new URL(AUTH_ROUTE.LOGIN, request.nextUrl));
    }

    if (isPublicRoute && session) {
        return NextResponse.redirect(new URL(BASE_URL, request.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};
