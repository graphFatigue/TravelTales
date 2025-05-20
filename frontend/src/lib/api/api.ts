import axios from 'axios';
import https from 'https';
import { getSession } from 'next-auth/react';

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});

api.interceptors.request.use(
	async config => {
		// Only add auth header for authenticated requests
		if (typeof window !== 'undefined') {
			// Check if we're on the client side
			const session = await getSession();
			if (session?.accessToken) {
				config.headers.Authorization = `Bearer ${session.accessToken}`;
			}
		}
		return config;
	},
	error => {
		return Promise.reject(error);
	},
);

api.interceptors.response.use(
	response => response,
	error => {
		if (error.response) {
			return Promise.reject({
				message: error.response.data?.error || 'Request failed',
				status: error.response.status,
				data: error.response.data,
			});
		}
		return Promise.reject(error);
	},
);

export default api;
