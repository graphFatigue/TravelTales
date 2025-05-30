import api from "./api";

export const authService = {
	forgotPassword: async (email: string) => {
		return api.post(`/api/Auth/forgot-password?email=${encodeURIComponent(email)}`);
	},

	resetPassword: async (email: string, token: string, newPassword: string) => {
		return api.post('/api/Auth/reset-password', {
			email,
			token,
			newPassword,
		});
	},
};
