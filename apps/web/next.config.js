/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@rapidlifeline/shared', '@rapidlifeline/ui-tokens'],
};

module.exports = nextConfig;

