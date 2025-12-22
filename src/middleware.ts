import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./lib/session";
import { SeoRedirectApi } from "./api/SeoRedirect";

const protectedRoutes = [
  "/thong-tin-tai-khoan",
  "/lich-su-dat-ve",
  "/thay-doi-mat-khau",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check authentication for protected routes
  const requiresAuth = protectedRoutes.some((path) =>
    pathname.startsWith(path)
  );

  if (requiresAuth) {
    const token = await getSession();

    if (!token.access_token) {
      const loginUrl = new URL("/dang-nhap", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Check SEO redirects (skip for API routes, static files, and Next.js internals)
  // This check happens AFTER authentication to avoid redirect loops
  if (
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/static") &&
    !pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)$/i)
  ) {
    try {
      // Check API for redirect
      const redirectInfo = await SeoRedirectApi.checkRedirect(pathname);

      if (redirectInfo && redirectInfo.found && redirectInfo.to_url) {
        // Build redirect URL
        let redirectUrl: string;
        if (redirectInfo.to_url.startsWith("http://") || redirectInfo.to_url.startsWith("https://")) {
          redirectUrl = redirectInfo.to_url;
        } else {
          redirectUrl = new URL(redirectInfo.to_url, request.url).toString();
        }

        return NextResponse.redirect(redirectUrl, (redirectInfo.redirect_type || 301) as 301 | 302);
      }
    } catch (error) {
      // Log error but don't block request - SEO redirects are non-critical
      console.error("[SEO Redirect Middleware] Error checking SEO redirect:", error);
    }
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
     * - favicon.ico (favicon file)
     * - static files (images, fonts, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)).*)",
  ],
};
