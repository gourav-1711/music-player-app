const { NextResponse } = require("next/server");
const { NextRequest } = require("next/server");

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("music-user")?.value;
  if (!token && pathname == "/profile") {
    return NextResponse.redirect(new URL("/login-register", req.url));
  }
  if (token && pathname == "/login-register") {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/profile", "/login-register"], // only run middleware on these routes
};
