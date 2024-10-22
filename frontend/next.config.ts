import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*', // путь на фронтенде
        destination: 'http://185.233.38.15/logistic/backend/:path*' // адрес бэкенда без SSL
        // destination: 'http://localhost:3100/:path*', // Зміна на localhost для локальної розробки
        // destination: 'http://183.55.66.88/:path*',
      },
    ];
  },
};

export default nextConfig;
