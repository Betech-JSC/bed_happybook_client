import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "./lib/session";

const protectedRoutes = [
  "/thong-tin-tai-khoan",
  "/lich-su-dat-ve",
  "/lich-su-dat-hang",
  "/thay-doi-mat-khau",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requiresAuth = protectedRoutes.some((path) =>
    pathname.startsWith(path)
  );

  if (!requiresAuth) return NextResponse.next();

  const response = NextResponse.next();
  const session = await getIronSession<SessionData>(request, response, sessionOptions);

  if (!session.access_token) {
    const loginUrl = new URL("/dang-nhap", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/thong-tin-tai-khoan",
    "/lich-su-dat-ve",
    "/lich-su-dat-ve/:path*",
    "/lich-su-dat-hang",
    "/lich-su-dat-hang/:path*",
    "/thay-doi-mat-khau",
  ],
};