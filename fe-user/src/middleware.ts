import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(request: NextRequest) {
  // Get the token from cookies
  const token = request.cookies.get("token")?.value;

  // Get the current path
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const publicPaths = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ];

  // Check if the current path is public
  const isPublicPath = publicPaths.some((p) => path === p);

  // If no token and trying to access protected route
  if (!token) {
    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // If has token
  try {
    const decoded = jwtDecode<UserPayload>(token);

    // Kiểm tra token hết hạn
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token"); // Xóa cookie hết hạn
      return response;
    }

    // --- LOGIC CHUYỂN HƯỚNG DỰA TRÊN ROLE ---
    const userRole = decoded.role;

    // A. Nếu đã đăng nhập và truy cập trang public (login, signup) -> chuyển về trang chủ tương ứng
    if (isPublicPath) {
      if (userRole === "ADMIN" || userRole === "TEACHER") {
        return NextResponse.redirect(
          new URL("/teacher/dashboard", request.url)
        );
      }
      return NextResponse.redirect(new URL("/", request.url)); // Trang chủ của Student
    }

    // B. Bảo vệ các route của Teacher/Admin
    const teacherAdminPaths = ["/teacher", "/admin"];
    if (teacherAdminPaths.some((p) => path.startsWith(p))) {
      if (!["ADMIN", "TEACHER"].includes(userRole)) {
        // Student cố gắng truy cập -> chuyển về trang access-denied
        return NextResponse.redirect(new URL("/access-denied", request.url));
      }
    }

    // C. Bảo vệ các route chỉ dành cho Admin
    const adminOnlyPaths = ["/admin"];
    if (adminOnlyPaths.some((p) => path.startsWith(p))) {
      if (userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/access-denied", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Invalid token:", error);
    // Nếu token không hợp lệ -> xóa cookie và chuyển về trang login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
