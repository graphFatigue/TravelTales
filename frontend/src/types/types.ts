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
	city: City | null;
	countryId: number | null;
	country: Country | null;
	visitedCities: City[] | null;
	visitedCountries: Country[] | null;
	visitedCityIds: number[] | null;
	visitedCountryIds: number[] | null;
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
	countryId: number;
}

export interface Country {
	id: number;
	name: string;
}

export interface Attachment {
	id: number;
	postId: number;
	number: number;
	uri: string;
	createdAt: string;
	modifiedAt: string;
	isDeleted: boolean;
}

export interface PostLike {
	postId: number;
	bloggerId: number;
}

export interface Notification {
	id: number;
	message: string;
	recipientBloggerId: number;
	recipientBlogger: Blogger;
	triggeredByBloggerId?: number;
	triggeredByBlogger?: Blogger;
	likedPostId?: number;
	likedBloggerId?: number;
	postId?: number;
	commentId?: number;
	isRead: boolean;
	createdAt: string;
}
export interface Comment {
	id: number;
	content: string;
	postId: number;
	post: Post | null;
	bloggerId: number;
	blogger: Blogger | null;
	createdAt?: string;
	modifiedAt?: string;
	isDeleted: boolean;
	bloggerName?: string;
	bloggerImage?: string | null;
	postAuthorBloggerId?: number | null;
}

export interface CreateComment {
	content: string;
	postId: number;
	bloggerId: number;
}

export interface UpdateComment {
	content: string;
}

export interface Post {
	id: number;
	title: string;
	content: string;
	blogger: Blogger;
	bloggerId?: number;
	categoryIds?: number[];
	categories?: Category[];
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
	isDeleted?: false;
}

export type BudgetLevel = 0 | 1 | 2 | 3 | 4;

export interface Role {
	id: string;
	name: string;
	createdAt: string;
	modifiedAt: string;
	isDeleted: boolean;
  }
  
  export interface UsersResponse {
	items: User[];
	currentPage: number;
	totalPages: number;
	pageSize: number;
	totalCount: number;
	hasPrevious: boolean;
	hasNext: boolean;
  }
  
  export interface AssignRoleRequest {
	userId: string;
	roleId: string;
  }