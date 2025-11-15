import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    // Verify admin access
    const payload = await verifyToken(req);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all active users
    const users = await prisma.users.findMany({
      //   where: {
      //     isDeleted: false
      //   },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        isDeleted: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json({ error: "Failed to get users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const payload = await verifyToken(req);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, username, password, fullName, role } = await req.json();

    // Validate required fields
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "Email, username and password are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email or username already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.users.create({
      data: {
        email,
        username,
        passwordHash,
        fullName,
        role: role || "STUDENT",
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
