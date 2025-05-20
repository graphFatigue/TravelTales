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
	image?: string | null;
	userId: string;
	posts: Post[] | null;
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

export interface Category {
	id: number;
	name: string;
	description: string;
	createdAt: string;
	modifiedAt: string | null;
	isDeleted: boolean;
}

export interface City {
	id: number;
	name: string;
}

export interface Country {
	id: number;
	name: string;
}

interface Attachment {
	id: number;
	postId: number;
	number: number;
	uri: string;
	createdAt: string;
	modifiedAt: string;
	isDeleted: boolean;
}

export interface PostLike {
	id: number;
	userId: number;
}

export interface Comment {
	id: number;
	content: string;
	userId: number;
	userName: string;
	createdAt: string;
}

export interface Post {
	id: number;
	title: string;
	content: string;
	blogger: Blogger;
	categoryIds?: number[];
	cityId?: number;
	city?: City | null;
	countryId?: number;
	country?: Country | null;
	tags?: string[];
	budget?: BudgetLevel;
	attachments?: Attachment[];
	likes?: PostLike[];
	comments?: Comment[];
	createdAt?: string;
	modifiedAt?: string;
}

export type BudgetLevel = 0 | 1 | 2 | 3 | 4;
