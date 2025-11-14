interface CloudinarySignature {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
}

interface CloudinaryUploadResult {
  asset_id: string;
  public_id: string;
  version: number;
  signature: string;
  width?: number;
  height?: number;
  format: string; // pdf, docx, png...
  resource_type: string; // image, raw, video
  created_at: string;
  bytes: number; // Kích thước file
  type: string;
  url: string;
  secure_url: string; // URL an toàn (https)
  original_filename: string; // Tên file gốc
  error?: {
    message: string;
  };
}
