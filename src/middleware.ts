import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/calendar/:path*",
    "/tickets/:path*",
    "/messages/:path*",
    "/workspace/:path*",
    "/progress/:path*",
    "/team/:path*",
    "/settings/:path*",
    "/reviews/:path*",
    "/login",
    "/signup",
  ],
};
