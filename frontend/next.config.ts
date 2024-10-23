import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*', // путь на фронтенде
        destination: 'http://185.233.38.15:3100/:path*'
        // destination: 'http://localhost:3100/:path*', // Зміна на localhost для локальної розробки
      },
    ];
  },
};

export default nextConfig;
