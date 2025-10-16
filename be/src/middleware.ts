import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const origin = req.headers.get("origin");
  const res = NextResponse.next();

  if (origin?.startsWith("http://localhost:")) {
    res.headers.set("Access-Control-Allow-Origin", origin);
  }
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.headers.set("Access-Control-Allow-Credentials", "true");

  // Nếu là OPTIONS, trả về 200 luôn
  if (req.method === "OPTIONS") {
    return NextResponse.json({}, { status: 200, headers: res.headers });
  }

  return res;
}

export const config = {
  matcher: ["/api/:path*"],
};
