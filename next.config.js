/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  transpilePackages: ["resend", "prettier", "prettier-plugin-tailwindcss"],
  images: {
    domains: ["imgix.cosmicjs.com"], // Add your Cosmic CDN domain
  },
};

module.exports = nextConfig;
