/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for deployment with mock data
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: { unoptimized: true },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Note: API routes are disabled in static export
  // To use API routes, remove 'output: export' and deploy to Vercel/Netlify
};

module.exports = nextConfig;