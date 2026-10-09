import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cho phép mở dev server từ máy khác trong mạng LAN (vd. test trên iPad/điện thoại) mà không bị chặn HMR.
  // Mỗi người tự khai báo host của mình trong .env.local, vd: DEV_ORIGINS=192.168.1.38
  allowedDevOrigins: process.env.DEV_ORIGINS?.split(",").map((host) => host.trim()).filter(Boolean),
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
