import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deshabilitar ESLint durante el build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Optimizar imágenes
  images: {
    unoptimized: true,
  },

  // Environment variables
  env: {
    CUSTOM_PORT: '3001',
  }
};

export default nextConfig;