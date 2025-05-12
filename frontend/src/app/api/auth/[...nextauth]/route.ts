import NextAuth, { NextAuthOptions, SessionStrategy } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import api from '@/lib/api';

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
					console.log(data);

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
					console.error('Login error:', error?.response?.data || error.message);
					throw new Error(
						error?.response?.data.error || error.message || 'Login failed',
					);
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.accessToken = user.accessToken;
				token.blogger = user.blogger;
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
