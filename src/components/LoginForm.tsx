"use client";

import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import * as authServices from "@/services/authServices";
import { useAppRouter } from "@/utils/routeHelper";

function LoginForm() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const { goHome } = useAppRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    // validate email
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    // validate password
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // nếu có lỗi thì setErrors và dừng lại
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Call API login
    const res = await authServices.login(email, password);

    if (res.error) {
      setErrors({ email: res.error, password: res.error });
      handleClear();
    } else {
      login(res.token);
      goHome();
      handleClear();
    }
  };

  const handleChange = (field: "email" | "password", value: string) => {
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);

    // clear lỗi field đó
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleClear = () => {
    setEmail("");
    setPassword("");
    inputRef.current?.focus();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          LogIn
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label
              className={`mb-1 flex items-center text-sm font-medium ${
                errors.email ? "text-red-500" : "text-gray-700"
              }`}
            >
              <FontAwesomeIcon icon={faEnvelope} className="mr-1 h-3.5 w-3.5" />
              Email *
            </label>
            <input
              ref={inputRef}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`w-full rounded-md border p-2 focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              className={`mb-1 flex items-center text-sm font-medium ${
                errors.password ? "text-red-500" : "text-gray-700"
              }`}
            >
              <FontAwesomeIcon icon={faLock} className="mr-1 h-3.5 w-3.5" />
              Password *
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => handleChange("password", e.target.value)}
              className={`w-full rounded-md border p-2 focus:ring-2 ${
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="w-full rounded-md bg-gradient-to-r from-blue-500 to-purple-500 py-2 text-white hover:opacity-90 cursor-pointer"
          >
            LogIn
          </button>
        </form>

        {/* Forgot password */}
        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </a>
        </div>

        {/* Signup */}
        <div className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
