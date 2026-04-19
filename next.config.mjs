/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium-min", "pdf-parse"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.alias["pdf-parse"] = "pdf-parse/lib/pdf-parse.js";
    }
    return config;
  },
};

export default nextConfig;
