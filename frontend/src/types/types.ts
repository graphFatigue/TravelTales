export interface User {
	id: string;
	email: string;
	name?: string;
	image?: string | null;
	blogger?: Blogger;
	roleName: 'Admin' | 'User';
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

export interface FollowBlogger {
	followerId: number;
	followerName: string;
	followerImage?: string | null;
	followingId: number;
	followingName: string;
	followingImage?: string | null;
	createdAt: string;
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

export interface triggeredByBlogger {
	id: number;
	firstName: string;
	lastName: string;
	image?: string | null;
}

// 		public class NotificationDto
			// {
			//     public long Id { get; set; }
			//     public string Message { get; set; }
			//     public long RecipientBloggerId { get; set; }
			//     public BloggerDto RecipientBlogger { get; set; }
			//     public long? TriggeredByBloggerId { get; set; }
			//     public BloggerDto TriggeredByBlogger { get; set; }
			//     public long? PostId { get; set; }
			//     public long? LikeId { get; set; }
			//     public long? CommentId { get; set; }
			//     public bool IsRead { get; set; }
			//     public DateTime CreatedAt { get; set; }
			// }

export interface Notification {
	id: number;
	message: string;
	recipientBloggerId: number;
	recipientBlogger?: Blogger;
	triggeredByBloggerId?: number;
	triggeredByBlogger?: Blogger | triggeredByBlogger;
	postId?: number;
	likeId?: number;
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
