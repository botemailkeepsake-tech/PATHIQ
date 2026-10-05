/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  async rewrites() {
    const destinationBase =
      process.env.INTERNAL_API_BASE ||
      process.env.NEXT_PUBLIC_API_BASE ||
      "http://localhost:8000/api/v1";
    return [
      {
        source: "/api/:path*",
        destination: `${destinationBase}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;