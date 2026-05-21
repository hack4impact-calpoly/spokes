/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "https://www.spokesfornonprofits.org/what-do-we-do/",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
