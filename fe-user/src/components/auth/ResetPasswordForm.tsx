"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import * as authService from "@/services/authServices";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams?.get("token") ?? "";
  const id = searchParams?.get("id") ?? "";

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    token?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token || !id) {
      setErrors((prev) => ({
        ...prev,
        token:
          "Liên kết không hợp lệ. Vui lòng thử lại hoặc yêu cầu gửi lại email.",
      }));
      toast.error("Đặt lại mật khẩu thất bại.");
    }
  }, [token, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!token || !id) {
      toast.error("Đặt lại mật khẩu thất bại.");
      return;
    }

    setIsSubmitting(true);

    const promise = (async () => {
      const res = await authService.resetPassword(
        token,
        id,
        formData.password,
        formData.confirmPassword
      );
      if (res?.errors) {
        // server returns errors object similar to signup/change-password
        setErrors(res.errors);
        throw new Error("validation");
      }
      if (res?.error) {
        throw new Error(res.error);
      }
      return res;
    })();

    toast
      .promise(promise, {
        pending: "Đang đặt lại mật khẩu...",
        success: "Đặt lại mật khẩu thành công!",
        error: "Đặt lại thất bại!",
      })
      .then(() => {
        // on success redirect to login
        router.replace("/login");
      })
      .catch(() => {
        // keep user on page to fix errors
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const inputClass = (hasError?: string) =>
    `mt-1 w-full rounded-lg px-3 py-2 focus:ring-2 ${
      hasError
        ? "border border-red-500 focus:ring-red-500"
        : "border border-gray-300 focus:ring-blue-500"
    }`;

  const labelClass = (hasError?: string) =>
    `block text-sm ${hasError ? "text-red-600" : "text-gray-700"}`;

  return (
    <>
      {errors.token && (
        <p className="text-sm text-red-600 mb-3">{errors.token}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass(errors.password)}>Mật khẩu mới*</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={inputClass(errors.password)}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <label className={labelClass(errors.confirmPassword)}>
            Xác nhận mật khẩu mới*
          </label>
          <input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={inputClass(errors.confirmPassword)}
            aria-invalid={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !!errors.token}
          className={`w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
            isSubmitting || !!errors.token
              ? "opacity-75 cursor-not-allowed"
              : ""
          }`}
        >
          {isSubmitting ? "Đang xử lý..." : "Đặt lại mật khẩu"}
        </button>
      </form>
    </>
  );
}
