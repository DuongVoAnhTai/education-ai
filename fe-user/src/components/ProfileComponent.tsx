"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, UserIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import * as userService from "@/services/userServices";
import * as cloudinaryService from "@/services/cloudinaryServices";

const ProfileComponent = () => {
  const { userDetail, refreshUserDetail } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const pickAvatar = () => fileRef.current?.click();

  useEffect(() => {
    if (userDetail) setUser(userDetail);
  }, [userDetail]);

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Hiển thị preview tạm
    const previewUrl = URL.createObjectURL(file);
    setPreviewFile(file);
    setUser((prev) => (prev ? { ...prev, avatarUrl: previewUrl } : prev));
    e.target.value = "";
  };

  const handleSave = async () => {
    if (!user) return;
    // try {
    //   let avatarUrl = user.avatarUrl ?? "";

    //   //Nếu có file mới → upload Cloudinary
    //   if (previewFile) {
    //     avatarUrl = await cloudinaryService.uploadImage(previewFile);
    //   }

    //   await userService.updateUser({
    //     fullName: user.fullName ?? "",
    //     avatarUrl,
    //     bio: user.bio ?? "",
    //   });

    //   await refreshUserDetail();
    //   toast.success("Cập nhật thành công!", {
    //     position: "top-right",
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     theme: "colored",
    //   });
    // } catch (err) {
    //   console.error(err);
    //   toast.error("Lưu thất bại!", {
    //     position: "top-right",
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     theme: "colored",
    //   });
    // }
    toast.promise(
      (async () => {
        let avatarUrl = user.avatarUrl ?? "";

        if (previewFile) {
          avatarUrl = await cloudinaryService.uploadImage(previewFile);
        }

        await userService.updateUser({
          fullName: user.fullName ?? "",
          avatarUrl,
          bio: user.bio ?? "",
        });

        await refreshUserDetail();
      })(),
      {
        pending: "Đang cập nhật...",
        success: "Cập nhật thành công!",
        error: "Lưu thất bại!",
      },
      {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "colored",
      }
    );
  };

  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Hồ sơ cá nhân
        </h3>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            {user?.avatarUrl ? (
              <Image
                priority
                src={user?.avatarUrl}
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover border"
                width={20}
                height={20}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                <UserIcon />
              </div>
            )}
            <button
              onClick={pickAvatar}
              className="absolute -bottom-1 -right-1 p-2 rounded-full bg-white border shadow hover:shadow-md cursor-pointer hover:bg-gray-100"
              title="Đổi ảnh"
            >
              <Camera size={16} />
            </button>
            <input
              ref={fileRef}
              type="file"
              hidden
              accept="image/*"
              onChange={onAvatarChange}
            />
          </div>

          {uploading && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-xs rounded-full">
              Uploading...
            </div>
          )}

          <div>
            <p className="font-medium">{user?.fullName}</p>
            <p className="text-gray-600 text-sm">{user?.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              Ảnh sẽ được lưu cục bộ trên trình duyệt của bạn.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-700">Email</span>
            <input
              value={user?.email ?? ""}
              onChange={(e) =>
                setUser((prev) =>
                  prev ? { ...prev, email: e.target.value } : prev
                )
              }
              className="mt-1 w-full bg-gray-200 border rounded-lg px-3 py-2 cursor-not-allowed"
              disabled
            />
          </label>
          <label className="block">
            <span className="text-sm text-gray-700">Tên</span>
            <input
              value={user?.fullName ?? ""}
              onChange={(e) =>
                setUser((prev) =>
                  prev ? { ...prev, fullName: e.target.value } : prev
                )
              }
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm text-gray-700">Bio</span>
            <textarea
              value={user?.bio ?? ""}
              onChange={(e) =>
                setUser((prev) =>
                  prev ? { ...prev, bio: e.target.value } : prev
                )
              }
              rows={4}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </label>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
