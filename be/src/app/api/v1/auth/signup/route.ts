import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

// POST create user
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const errors: ValidationErrorSignup = {};
    // const defaultAvatar =
      // "https://scontent.fsgn2-7.fna.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=cp0_dst-png_s40x40&_nc_cat=1&ccb=1-7&_nc_sid=b224c7&_nc_ohc=D3fOwr6x0ZcQ7kNvwG6Jots&_nc_oc=AdkyhXHO6221ZTvhfdh_letjFGRL4spAfUrKqHHL4UszMoxYiiWf399OFThX8oqRvn8&_nc_zt=24&_nc_ht=scontent.fsgn2-7.fna&oh=00_Afc4XBdFgdfdt66D70W2puH4mbBFP4FoFz8rOGXQwUTUOQ&oe=691E9EFA";

    // Required fields validation
    if (!data.email) errors.email = "Email is required";
    if (!data.username) errors.username = "Username is required";
    if (!data.firstName) errors.firstName = "First name is required";
    if (!data.lastName) errors.lastName = "Last name is required";
    if (!data.password) errors.password = "Password is required";
    if (!data.confirmPassword)
      errors.confirmPassword = "Confirm password is required";

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
      errors.email = "Invalid email format";
    }

    // Check if user already exists
    if (data.email && emailRegex.test(data.email)) {
      const existingUser = await prisma.users.findFirst({
        where: {
          OR: [{ email: data.email }, { username: data.username }],
        },
      });

      if (existingUser) {
        if (existingUser.email === data.email) {
          errors.email = "Email already exists";
        }
        if (existingUser.username === data.username) {
          errors.username = "Username already exists";
        }
      }
    }

    // Password validations
    // Check password strength (uppercase, lowercase, digit, special char)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

    if (!passwordRegex.test(data.password)) {
      errors.password =
        "Password must include at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special symbol";
    }

    if (data.password.length < 8) {
      errors.password = "Password is too short";
    }

    if (
      data.password &&
      data.confirmPassword &&
      data.password !== data.confirmPassword
    ) {
      errors.confirmPassword = "Passwords do not match";
    }

    // If there are any validation errors, return them all
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const fullName = `${data.firstName} ${data.lastName}`.trim();

    const user = await prisma.users.create({
      data: {
        username: data.username,
        email: data.email,
        passwordHash: hashedPassword,
        fullName: fullName,
        role: data.role || "STUDENT",
        avatarUrl: data.avatarUrl || /* defaultAvatar */ null,
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
