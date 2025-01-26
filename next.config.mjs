/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'seller-product-images.s3.amazonaws.com',
        port: '',
      },
    ],
  },
};

export default nextConfig;
