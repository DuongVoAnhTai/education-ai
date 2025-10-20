import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // Cho phép tất cả path từ Cloudinary
      },
      {
        protocol: "https",
        hostname: "sevenpillarsinstitute.org",
        pathname: "/wp-content/uploads/**", // Giới hạn path cho ảnh từ sevenpillarsinstitute
      },
    ],
  },
};

export default nextConfig;
