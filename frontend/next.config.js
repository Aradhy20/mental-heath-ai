/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const backend = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    return [
      {
        source: '/api/:path*',
        destination: `${backend}/api/:path*`,
      },
      {
        source: '/docs',
        destination: `${backend}/docs`,
      },
      {
        source: '/openapi.json',
        destination: `${backend}/openapi.json`,
      }
    ]
  },
}

module.exports = nextConfig
