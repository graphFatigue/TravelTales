import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	experimental: {
		staleTimes: {
			dynamic: 30,
		},
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'traveltalesblob2025.blob.core.windows.net',
				port: '',
				pathname: '**',
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				port: '',
				pathname: '**',
			},
		],
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
