/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  images: {
    domains: ["imgix.cosmicjs.com"], // Add your Cosmic CDN domain
  },
};

module.exports = nextConfig;
