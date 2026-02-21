/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: false,
  // Tree-shake heavy packages to reduce JS bundle size → lowers TBT
  experimental: {
    optimizePackageImports: [
      "swiper",
      "lucide-react",
      "lodash",
      "@radix-ui/react-icons",
      "embla-carousel-react",
      "embla-carousel-autoplay",
    ],
  },
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
    formats: ["image/avif", "image/webp"],
  },
  webpack: (config, { isServer }) => {
    // Split large chunks to reduce initial JS payload → lowers TBT
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        chunks: "all",
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          // Isolate swiper into its own chunk (it's heavy)
          swiper: {
            name: "swiper",
            test: /[\\/]node_modules[\\/](swiper)[\\/]/,
            chunks: "all",
            priority: 20,
          },
        },
      };
    }
    return config;
  },
};
export default nextConfig;
