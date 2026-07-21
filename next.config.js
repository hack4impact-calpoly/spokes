/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/jobs",
        permanent: false,
      },
      {
        source: "/jobform",
        destination: "/jobs/list",
        permanent: false,
      },
      {
        source: "/dashboard",
        destination: "/jobs/manage",
        permanent: false,
      },
      {
        source: "/admin",
        destination: "/jobs/admin",
        permanent: false,
      },
      {
        source: "/jobsDashboard",
        destination: "/jobs",
        permanent: false,
      },
      {
        source: "/jobsDashboard/jobs",
        destination: "/jobs",
        permanent: false,
      },
      {
        source: "/jobsDashboard/admin",
        destination: "/jobs/admin",
        permanent: false,
      },
      {
        source: "/eventsDashboard",
        destination: "/events",
        permanent: false,
      },
      {
        source: "/eventsDashboard/events",
        destination: "/events",
        permanent: false,
      },
      {
        source: "/eventsDashboard/admin",
        destination: "/events/admin",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
