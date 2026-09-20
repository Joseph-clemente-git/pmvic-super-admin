import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "pmvic_session";
const HOME = "/superadmin/dashboard";

type SessionCookie = { role: "superadmin" };

function readSession(request: NextRequest): SessionCookie | null {
  const raw = request.cookies.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return null;
  }
}

const PUBLIC_PATHS = ["/login", "/forgot-password", "/reset-password"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = readSession(request);

  if (pathname === "/") {
    return NextResponse.redirect(new URL(session ? HOME : "/login", request.url));
  }

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (isPublic) {
    if (session && pathname === "/login") {
      return NextResponse.redirect(new URL(HOME, request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|svg|ico|webp)$).*)"],
};
