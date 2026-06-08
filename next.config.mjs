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
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8001',
        pathname: '/**',
      },
      {
        protocol: process.env.NEXT_PUBLIC_PROTOCAL || 'https',
        hostname: process.env.NEXT_PUBLIC_HOSTNAME || 'api.happybooktravel.com',
        port: "",
        pathname: "/**",
      },
      {
        protocol: process.env.NEXT_PUBLIC_PROTOCAL || 'https',
        hostname: process.env.NEXT_PUBLIC_CDN_DOMAIN || 'cdn.happybooktravel.com',
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.nhanhtravel.io.vn",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cms.happybooktravel.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/**",
      },
    ],
    loader: "default",
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/tours/tour-quoc_te",
        destination: "/tours/tour-quoc-te",
        permanent: true,
      },
    ];
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
