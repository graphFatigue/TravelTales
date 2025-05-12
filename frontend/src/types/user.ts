export interface User {
	id: string;
	email: string;
	name?: string;
	image?: string | null;
	blogger?: Blogger;
}

export interface Blogger {
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
