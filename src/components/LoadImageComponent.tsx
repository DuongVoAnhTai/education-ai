"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import * as userService from "@/services/userServices";
import * as cloudinaryService from "@/services/cloudinaryServices";

function LoadImageComponent() {
  const [result, setResult] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const defaultAvatar =
    "https://sevenpillarsinstitute.org/wp-content/uploads/2017/10/facebook-avatar-1.jpg";

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const userData = await userService.getUser();
        setResult(userData || null);
      } catch (error) {
        setError("Failed to load user data");
        console.log(error);
      }
    };

    fetchApi();
  }, []);

  // Handle chọn file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // Giới hạn 5MB
        setError("Image size must be less than 5MB");
        return;
      }
      setFile(file);
    }
  };

  // Function upload ảnh lên Cloudinary
  const handleUpload = async () => {
    if (!file) {
      setError("Vui lòng chọn file ảnh");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Upload image and get URL
      const avatarUrl = await cloudinaryService.uploadImage(file);

      // Bước 3: Cập nhật vào DB qua API
      const updatedUser = await userService.updateUser({ avatarUrl });

      if (updatedUser) {
        setResult(updatedUser); // Update state để hiển thị ngay
        setFile(null); // Reset file
      } else {
        setError("Failed to update user avatar");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!result) return <div>Loading...</div>;

  return (
    <div>
      <h1>{result.fullName || "No name provided"}</h1>
      <Image
        src={result.avatarUrl || defaultAvatar}
        alt=""
        width={100}
        height={100}
      />

      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading || !file}>
        {uploading ? "Uploading..." : "Upload Avatar"}
      </button>
    </div>
  );
}

export default LoadImageComponent;
