const { chakra } = require("@chakra-ui/react");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
};

module.exports = nextConfig;
