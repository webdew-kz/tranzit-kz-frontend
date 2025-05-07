/** @format */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
        SERVER_URL: process.env.SERVER_URL,
        GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
        JWT_SECRET: process.env.JWT_SECRET,
        DOMAIN: process.env.DOMAIN,
    },
};

export default nextConfig;
