import axios from 'axios';
import https from 'https';

const api = axios.create({
	baseURL: process.env.API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});

api.interceptors.response.use(
	response => response,
	error => {
		if (error.response) {
			return Promise.reject({
				message: error.response.data?.message || 'Request failed',
				status: error.response.status,
				data: error.response.data,
			});
		}
		return Promise.reject(error);
	},
);

export default api;
