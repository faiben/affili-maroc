/** @type {import('next').NextConfig} */
const isNetlify = process.env.NETLIFY === "true" || process.env.NEXT_PUBLIC_NETLIFY === "true";

const nextConfig = {
  // Netlify handles the Next.js output via its own runtime; "standalone"
  // is only used for the Docker deployment.
  output: isNetlify ? undefined : "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
