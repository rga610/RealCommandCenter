/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['drive.google.com'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "listing-media.b-cdn.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;