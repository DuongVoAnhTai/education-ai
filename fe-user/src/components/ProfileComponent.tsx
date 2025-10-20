"use client";

import { useRef, useState } from "react";
import { Camera, UserIcon } from "lucide-react";

type Profile = {
  name: string;
  email: string;
  goal: string;
  bio: string;
  /** new: ảnh đại diện (data URL) */
  avatar?: string;
};

const ProfileComponent = () => {
  const onAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const f = e.target.files?.[0];
    if (!f) return;
    // đọc thành base64 để lưu được trong localStorage
    const toDataURL = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.onerror = reject;
        r.readAsDataURL(file);
      });
    try {
      const dataUrl = await toDataURL(f);
      setProfile((p) => ({ ...p, avatar: dataUrl }));
    } catch {
      alert("Không thể đọc ảnh. Vui lòng thử ảnh khác.");
    } finally {
      e.target.value = "";
    }
  };
  const fileRef = useRef<HTMLInputElement>(null);
  const pickAvatar = () => fileRef.current?.click();
  const persist = <T,>(key: string, value: T) =>
    localStorage.setItem(key, JSON.stringify(value));
  const readPersist = <T,>(key: string, fallback: T): T => {
    if (typeof window === "undefined") return fallback;
    try {
      const s = localStorage.getItem(key);
      return s ? (JSON.parse(s) as T) : fallback;
    } catch {
      return fallback;
    }
  };
  const [profile, setProfile] = useState<Profile>(
    readPersist<Profile>("edu.profile", {
      name: "Học viên",
      email: "student@example.com",
      goal: "Đạt 9.0/10 cho môn AI",
      bio: "Yêu thích học máy, xử lý ngôn ngữ tự nhiên và xây sản phẩm AI hữu ích.",
      avatar: undefined,
    })
  );
  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Hồ sơ cá nhân
        </h3>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover border"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                <UserIcon />
              </div>
            )}
            <button
              onClick={pickAvatar}
              className="absolute -bottom-1 -right-1 p-2 rounded-full bg-white border shadow hover:shadow-md"
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

          <div>
            <p className="font-medium">{profile.name}</p>
            <p className="text-gray-600 text-sm">{profile.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              Ảnh sẽ được lưu cục bộ trên trình duyệt của bạn.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-700">Tên</span>
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm text-gray-700">Email</span>
            <input
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm text-gray-700">Mục tiêu</span>
            <input
              value={profile.goal}
              onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm text-gray-700">Giới thiệu</span>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={4}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </label>
        </div>

        <div className="flex justify-end mt-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Đã lưu (auto)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
