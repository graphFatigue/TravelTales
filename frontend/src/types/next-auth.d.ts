import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { Blogger } from './user';

declare module 'next-auth' {
	interface Session {
		accessToken?: string;
		user: {
			id: string;
			email: string;
			name?: string;
			image?: string | null;
			blogger?: Blogger;
		};
	}

	interface User {
		id: string;
		email: string;
		name?: string;
		image?: string | null;
		accessToken: string;
		blogger: Blogger;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		accessToken: string;
		blogger: Blogger;
		sub: string;
	}
}

