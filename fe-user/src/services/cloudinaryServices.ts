import * as httpRequest from "@/utils/httpRequest";

export const getSignature = async (): Promise<CloudinarySignature> => {
  try {
    // Bước 1: Lấy chữ ký từ API route
    const res = await httpRequest.get("cloudinary-signature");
    
    return res;
  } catch (error) {
    console.error("Get signature error:", error);
    throw error;
  }
};

export const uploadImage = async (file: File): Promise<string> => {
  try {
    // Bước 1: Lấy chữ ký từ API route
    const { signature, timestamp, cloudName, apiKey } = await getSignature();

    // Bước 2: Upload ảnh lên Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("api_key", apiKey);
    formData.append("folder", "avatars");

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data: CloudinaryUploadResult = await response.json();

    if (!data.secure_url) {
        // Upload thành công, lấy URL
      throw new Error(data.error?.message || "Upload failed");
    }

    return data.secure_url;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};