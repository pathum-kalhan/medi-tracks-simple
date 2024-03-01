/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
  },
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
