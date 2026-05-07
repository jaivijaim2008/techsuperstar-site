/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.sanity.io'],
  },
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
};

module.exports = nextConfig;