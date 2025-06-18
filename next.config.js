/** @type {import('next').NextConfig} */
module.exports = {
  swcMinify: false,
  reactStrictMode: true,
  webpack: (config) => {
    return config;
  }
}