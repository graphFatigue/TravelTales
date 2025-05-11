import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';

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

interface Blogger {
	id: number;
	firstName: string;
	lastName: string;
	birthDate: string;
	sex: string;
	bio: string;
	image: string | null;
	userId: string;
	posts: any; // If you want more strict typing, define Post[]
	createdAt: string;
	modifiedAt: string | null;
	isDeleted: boolean;
}
