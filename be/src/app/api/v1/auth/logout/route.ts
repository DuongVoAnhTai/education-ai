import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Xóa cookie chứa token
    const res = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    res.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0, // Lam cookie het han ngay lap tuc
    });

    return res;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}

// Cho phép method POST
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
