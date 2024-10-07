/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: process.env.NEXT_PUBLIC_HOSTNAME,
        port: "",
        pathname: "/**",
      },
    ],
  },
};
export default nextConfig;
