import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./lib/session";

const protectedRoutes = [
  "/thong-tin-tai-khoan",
  "/lich-su-dat-ve",
  "/thay-doi-mat-khau",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requiresAuth = protectedRoutes.some((path) =>
    pathname.startsWith(path)
  );

  if (!requiresAuth) return NextResponse.next();

  const token = await getSession();

  if (!token.access_token) {
    const loginUrl = new URL("/dang-nhap", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/thong-tin-tai-khoan", "/lich-su-dat-ve", "/thay-doi-mat-khau"],
};
