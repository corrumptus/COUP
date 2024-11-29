/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/jogar/:id",
        destination: "/jogar/:id"
      },
      {
        source: '/:path*',
        destination: '/',
      }
    ];
  }
};

export default nextConfig;