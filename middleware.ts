import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Since we use static password authentication for admin routes, this middleware is not critical
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
