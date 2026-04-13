/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Известные статические изображения
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Динамические изображения из Firebase (вводятся в админке — любой домен)
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;

