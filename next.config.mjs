/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: process.env.NEXT_PUBLIC_CDN_URL,
  images: {
    remotePatterns: [
      {
        protocol: process.env.NEXT_PUBLIC_PROTOCAL,
        hostname: process.env.NEXT_PUBLIC_HOSTNAME,
        pathname: "/**",
      },
      {
        protocol: process.env.NEXT_PUBLIC_PROTOCAL,
        hostname: process.env.NEXT_PUBLIC_CDN_HOSTNAME,
        port: process.env.NEXT_PUBLIC_PORT ?? "",
        pathname: "/**",
      },
    ],
  },
};
export default nextConfig;
