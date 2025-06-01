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
						role: data.role,
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
			authorization: {
				params: {
					prompt: 'consent',
					access_type: 'offline',
					response_type: 'code',
					scope: 'openid email profile',
				},
			},
		}),
	],
	callbacks: {
		async signIn({ account }) {
			if (account?.provider === 'google') {
				try {
					const response = await api.post('/api/Auth/signin-google', {
						token: account.id_token,
					});

					if (!response.data?.accessToken) {
						return false;
					}

					return true;
				} catch (error) {
					console.error('Google sign-in error:', error);
					return false;
				}
			}
			return true;
		},
		async jwt({ token, account, user }) {
			if (account?.provider === 'google') {
				try {
					const { data } = await api.post('/api/Auth/signin-google', {
						token: account.id_token,
					});

					return {
						accessToken: data.accessToken,
						blogger: data.user.blogger,
						sub: data.user.id,
						role: data.role,
					};
				} catch (error) {
					console.error('JWT callback error:', error);
					return token;
				}
			}

			if (user) {
				token.accessToken = user.accessToken;
				token.blogger = user.blogger;
				token.sub = user.id;
				token.role = user.role;
			}

			return token;
		},
		async session({ session, token }) {
			session.accessToken = token.accessToken;
			session.user.id = token.sub;
			session.user.blogger = token.blogger;
			session.role = token.role;
			return session;
		},
	},
	session: {
		strategy: 'jwt' as SessionStrategy,
		maxAge: 48 * 60 * 60,
	},
	pages: {
		signIn: '/login',
		signOut: '/login',
		error: '/login',
	},
};
