"use client";

import { useRef, useState } from "react";
import "@/styles/styles.css";
import { useAuth } from "@/context/AuthContext";
import * as authServices from "@/services/authServices";
import { X } from "lucide-react";
import { toast } from "react-toastify";

function LoginForm() {
  const { login } = useAuth();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    invalid?: string;
    emailOrUsername?: string;
    password?: string;
  }>({});

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});

    // Call API login
    const res = await authServices.login(emailOrUsername, password);

    if (res.errors) {
      setErrors(res.errors);
      toast.error("Đăng nhập thất bại.", {
        theme: "colored",
      });

      handleClear();
    } else {
      login(res.token, res.user);
      toast.success("Đăng nhập thành công!", {
        theme: "colored",
        autoClose: 3000,
      });
      handleClear();
    }
  };

  const handleChange = (
    field: "emailOrUsername" | "password",
    value: string
  ) => {
    if (field === "emailOrUsername") setEmailOrUsername(value);
    if (field === "password") setPassword(value);

    // clear lỗi field đó
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleClear = () => {
    setEmailOrUsername("");
    setPassword("");
    inputRef.current?.focus();
  };

  const handleCloseError = () => {
    setErrors((prev) => ({ ...prev, invalid: undefined }));
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {errors.invalid && (
        <p className="mb-4 rounded-md bg-red-100 p-3 text-center text-sm text-red-700 relative">
          {errors.invalid}
          <X
            size={20}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-red-700 hover:text-red-500"
            onClick={handleCloseError}
          />
        </p>
      )}

      {/* Email or Username */}
      <div>
        <div className={`input-group ${errors.emailOrUsername ? "error" : ""}`}>
          <input
            ref={inputRef}
            type="text"
            id="emailOrUsername"
            value={emailOrUsername}
            onChange={(e) => handleChange("emailOrUsername", e.target.value)}
            placeholder=" "
            className="input-field"
          />
          <label htmlFor="emailOrUsername" className="input-label">
            Username or email address
          </label>
        </div>
        {errors.emailOrUsername && (
          <p className="mt-1 text-sm text-red-500">{errors.emailOrUsername}</p>
        )}
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
            Password
          </label>
        </div>
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
  );
}

export default LoginForm;
