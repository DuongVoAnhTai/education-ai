import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

// GET all users
// export async function GET() {
//   const users = await prisma.user.findMany({
//     where: { isDeleted: false },
//     orderBy: { createdAt: "desc" },
//   });
//   return NextResponse.json(users);
// }

// POST create user
export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Validate required fields
    if (!data.username || !data.email || !data.password) {
      return NextResponse.json(
        { error: "Username, email and password are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or username already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.users.create({
      data: {
        username: data.username,
        email: data.email,
        passwordHash: hashedPassword,
        fullName: data.fullName || null,
        role: data.role || "STUDENT",
        avatarUrl: data.avatarUrl || null,
      },
    });

    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
