/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/jobsDashboard/jobs",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
