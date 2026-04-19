/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // produces .next/standalone/server.js for Docker
  experimental: {
    serverComponentsExternalPackages: ["puppeteer-core", "@sparticuz/chromium-min", "pdf-parse"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // pdf-parse tries to load test files at module load time; this prevents that
      config.resolve.alias["pdf-parse"] = "pdf-parse/lib/pdf-parse.js";
    }
    return config;
  },
};

export default nextConfig;
