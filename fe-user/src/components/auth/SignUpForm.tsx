"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import "@/styles/styles.css";
import { toast } from "react-toastify";
import * as authServices from "@/services/authServices";

export default function SignUpForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Gọi API register
    const res = await authServices.signup(
      email,
      username,
      firstName,
      lastName,
      password,
      confirmPassword
    );

    if (res.errors) {
      setErrors(res.errors);
      toast.error("Đăng ký thất bại.", {
        theme: "colored",
      });
    } else {
      toast.success("Đăng ký thành công!", {
        theme: "colored",
      });
      // thành công → chuyển hướng login
      router.push("/login");
    }
  };

  const handleChange = (
    field:
      | "email"
      | "username"
      | "firstName"
      | "lastName"
      | "password"
      | "confirmPassword",
    value: string
  ) => {
    if (field === "email") setEmail(value);
    if (field === "username") setUsername(value);
    if (field === "firstName") setFirstName(value);
    if (field === "lastName") setLastName(value);
    if (field === "password") setPassword(value);
    if (field === "confirmPassword") setConfirmPassword(value);
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-green-600">
          Sign Up
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <div className={`input-group ${errors.email ? "error" : ""}`}>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder=" "
                className="input-field"
              />
              <label htmlFor="email" className="input-label">
                Email*
              </label>
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <div className={`input-group ${errors.username ? "error" : ""}`}>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder=" "
                className="input-field"
              />
              <label htmlFor="username" className="input-label">
                Username*
              </label>
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username}</p>
            )}
          </div>

          {/* FullName */}
          <div className="flex gap-4">
            {/* First Name - đã cập nhật */}
            <div className="w-1/2">
              <div className={`input-group ${errors.firstName ? "error" : ""}`}>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder=" "
                  className="input-field"
                />
                <label htmlFor="firstName" className="input-label">
                  First Name*
                </label>
              </div>
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name - đã cập nhật */}
            <div className="w-1/2">
              <div className={`input-group ${errors.lastName ? "error" : ""}`}>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder=" "
                  className="input-field"
                />
                <label htmlFor="lastName" className="input-label">
                  Last Name*
                </label>
              </div>
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <div className={`input-group ${errors.password ? "error" : ""}`}>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder=" "
                className="input-field"
              />
              <label htmlFor="password" className="input-label">
                Password*
              </label>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <div
              className={`input-group ${errors.confirmPassword ? "error" : ""}`}
            >
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                placeholder=" "
                className="input-field"
              />
              <label htmlFor="confirmPassword" className="input-label">
                ConfirmPassword*
              </label>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <p className="text-sm text-gray-500 mt-1">
            - Password should be more than 8 characters.
            <br />
            - Password should contain:
            <br />
            <span className="pl-4">+ At least one uppercase letter</span>
            <br />
            <span className="pl-4">+ At least one lowercase letter</span>
            <br />
            <span className="pl-4">+ At least one digit</span>
            <br />
            <span className="pl-4">+ At least one special symbol</span>
          </p>

          {/* Signup button */}
          <button
            type="submit"
            className="w-full rounded-md bg-gradient-to-r from-green-500 to-teal-500 py-2 text-white hover:opacity-90 cursor-pointer"
          >
            Sign Up
          </button>
        </form>

        {/* Link Login */}
        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-green-600 hover:underline"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
