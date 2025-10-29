"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import * as authService from "@/services/authServices";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [isEmailSent, setIsEmailSent] = useState(false); // thêm state mới

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await authService.forgotPassword(email);

      if (res.errors) {
        setErrors(res.errors);
        toast.error("Gửi email thất bại");
      } else {
        toast.success("Gửi email thành công");
        setEmail("");
        setIsEmailSent(true);
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
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
      {!isEmailSent ? (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className={labelClass(errors.email)}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleChange}
              className={inputClass(errors.email)}
              placeholder="Nhập địa chỉ email"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSubmitting ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-2 text-sm text-gray-600">
          Liên kết đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm
          tra hộp thư.
        </p>
      )}
    </>
  );
}
