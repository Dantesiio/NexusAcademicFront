/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
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

module.exports = nextConfig; 