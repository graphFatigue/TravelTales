import { NextAuthOptions, SessionStrategy } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import api from '@/lib/api/api';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				try {
					const { data } = await api.post('/api/Auth/login', credentials);

					if (!data?.accessToken) return null;

					return {
						id: data.user.id,
						email: data.user.email,
						name: `${data.user.blogger.firstName} ${data.user.blogger.lastName}`,
						image: data.user.blogger.image,
						accessToken: data.accessToken,
						blogger: data.user.blogger,
					};
				} catch (err: unknown) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const error = err as any;
					throw new Error(
						error?.response?.data.error || error.message || 'Login failed',
					);
				}
			},
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	callbacks: {
		async jwt({ token, account, user }) {
			if (account?.provider === 'google') {
				// Get your API token using Google access token
				const googleAccessToken = account.access_token;

				console.log(googleAccessToken);

				try {
					const { data } = await api.post('/api/Auth/login/google', {
						accessToken: googleAccessToken,
					});

					token.accessToken = data.accessToken;
					token.blogger = data.user.blogger;
					token.sub = data.user.id;
				} catch (error) {
					console.error('Failed to login via Google to your backend', error);
					throw new Error('Login failed');
				}
			}

			if (user) {
				token.accessToken = user.accessToken;
				token.blogger = user.blogger;
				token.sub = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			session.accessToken = token.accessToken;
			session.user.id = token.sub;
			session.user.blogger = token.blogger;
			return session;
		},
	},
	session: {
		strategy: 'jwt' as SessionStrategy,
		maxAge: 24 * 60 * 60,
	},
	pages: {
		signIn: '/login',
		signOut: '/login',
		error: '/login',
	},
};
