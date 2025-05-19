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
	sex: Sex;
	bio: string;
	image: string | null;
	userId: string;
	posts: string[] | null; // Ideally Post[] or null
	createdAt: string;
	modifiedAt: string | null;
	isDeleted: boolean;
	followerCount: number;
	followingCount: number;
	isFollowing: boolean;
	cityId: number | null;
	city: string | null;
	countryId: number | null;
	country: string | null;
}

export enum Sex {
	Male = 1,
	Female = 2,
	Other = 3, // etc.
}
