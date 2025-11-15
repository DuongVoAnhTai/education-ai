import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Verify token and check role
    const payload = await verifyToken(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Chỉ cho phép ADMIN truy cập
    if (payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    const userId = id;

    const user = await prisma.users.findUnique({
      where: {
        id: userId,
        // isDeleted: false, // Không lấy user đã bị xóa
        role: "STUDENT", // Chỉ lấy thông tin học sinh
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { error: "Failed to fetch student information" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await verifyToken(req);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { email, username, fullName, role, isDeleted } = await req.json();

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user
    const updatedUser = await prisma.users.update({
      where: { id },
      data: {
        email,
        username,
        fullName,
        role,
        isDeleted,
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

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await verifyToken(req);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Soft delete user
    await prisma.users.update({
      where: { id },
      data: { isDeleted: true },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
