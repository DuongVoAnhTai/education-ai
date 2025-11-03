"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import * as userService from "@/services/userServices";

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
  }>({
    currentPassword: undefined,
    newPassword: undefined,
    confirmNewPassword: undefined,
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const res = await userService.changePassword(formData);

      if (res?.errors) {
        setErrors(res.errors);
        toast.error("Có lỗi. Vui lòng kiểm tra form.", {
          theme: "colored",
        });
      } else {
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        toast.success("Đổi mật khẩu thành công!", {
          theme: "colored",
        });
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lưu thất bại!", {
        theme: "colored",
      });
    }
  };

  const labelClass = (hasError?: string) =>
    `block text-sm ${hasError ? "text-red-600" : "text-gray-700"}`;

  const inputClass = (hasError?: string) =>
    `mt-1 w-full rounded-lg px-3 py-2 focus:ring-2 ${
      hasError
        ? "border border-red-500 focus:ring-red-500"
        : "border border-gray-300 focus:ring-blue-500"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass(errors.currentPassword)}>
          Mật khẩu hiện tại*
        </label>
        <input
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          className={inputClass(errors.currentPassword)}
          aria-invalid={!!errors.currentPassword}
        />
        {errors.currentPassword && (
          <p className="text-sm text-red-500 mt-1">{errors.currentPassword}</p>
        )}
      </div>

      <div>
        <label className={labelClass(errors.newPassword)}>Mật khẩu mới*</label>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          className={inputClass(errors.newPassword)}
          aria-invalid={!!errors.newPassword}
        />
        {errors.newPassword && (
          <p className="text-sm text-red-500 mt-1">{errors.newPassword}</p>
        )}
      </div>

      <div>
        <label className={labelClass(errors.confirmNewPassword)}>
          Xác nhận mật khẩu mới*
        </label>
        <input
          type="password"
          name="confirmNewPassword"
          value={formData.confirmNewPassword}
          onChange={handleChange}
          className={inputClass(errors.confirmNewPassword)}
          aria-invalid={!!errors.confirmNewPassword}
        />
        {errors.confirmNewPassword && (
          <p className="text-sm text-red-500 mt-1">
            {errors.confirmNewPassword}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Lưu thay đổi
      </button>
    </form>
  );
}
