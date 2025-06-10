import { NextResponse } from "next/server";
import { isTokenValid } from "@/lib/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("faceToken")?.value;
  // Only log for debugging non-static routes
  if (!request.nextUrl.pathname.startsWith("/_next")) {
    console.log("middleware", request.nextUrl.pathname);
  }

  // Allow these routes without auth
  const publicPaths = ["/", "/login"];
  if (publicPaths.some((path) => request.nextUrl.pathname == path)) {
    return NextResponse.next();
  }

  if (!token || !isTokenValid(token)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
