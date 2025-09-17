interface CloudinarySignature {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
}

interface CloudinaryUploadResult {
  secure_url: string;
  error?: {
    message: string;
  };
}