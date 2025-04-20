/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: process.env.NEXT_PUBLIC_PROTOCAL,
        hostname: process.env.NEXT_PUBLIC_HOSTNAME,
        port: "",
        pathname: "/**",
      },
      {
        protocol: process.env.NEXT_PUBLIC_PROTOCAL,
        hostname: process.env.NEXT_PUBLIC_CDN_DOMAIN,
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
    ],
    loader: "default",
    path: process.env.NEXT_PUBLIC_CDN_URL,
    domains: ['storage.googleapis.com'],
    unoptimized: true
  },
};
export default nextConfig;
