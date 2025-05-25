import { Blogger } from './types';

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
		role: string;
	}

	interface User {
		id: string;
		email: string;
		name?: string;
		image?: string | null;
		accessToken: string;
		blogger: Blogger;
		role: string;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		accessToken: string;
		blogger: Blogger;
		sub: string;
		role: string;
	}
}
