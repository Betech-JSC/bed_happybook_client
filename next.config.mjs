/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "cms.happybooktravel.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
