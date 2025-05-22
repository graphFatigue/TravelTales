import { PostCardPreview } from '@/components/Post/PostCardPreview';
import { Button } from '@/components/ui/button';
import { Post } from '@/types/types';
import Link from 'next/link';

export default async function Home() {
	return (
		<main className='h-[200vh] w-full'>
			<div className='w-full'>
				<Link href='/post/new'>
					<Button>Create new post</Button>
				</Link>
				<PostCardPreview post={post}/>
			</div>
		</main>
	);
}

const post: Post = {
	id: 8,
	title: 'Post upgrade',
	content:
		'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat.',
	bloggerId: 15,
	blogger: {
		id: 15,
		firstName: 'Iryna',
		lastName: 'Bibik',
		birthDate: '2011-09-03T00:00:00',
		sex: 1,
		bio: 'It works! ',
		image:
			'https://traveltalesblob2025.blob.core.windows.net/user-photos/iryna.bibik-nure.ua-9ec01b08-d163-4f93-ab57-6de83a386ac2.jpg',
		userId: '1becd495-1239-4af9-4a1e-08dd96ca458a',
		followerCount: 0,
		followingCount: 0,
		isFollowing: false,
		cityId: 59060,
		city: null,
		countryId: 214,
		country: null,
		posts: [],
		createdAt: '2025-05-19T15:30:00.3498964',
		modifiedAt: '2025-05-22T12:46:19.7819768',
		isDeleted: false,
	},
	categoryIds: [1, 2, 3, 4, 5, 6],
	cityId: 1,
	city: null,
	countryId: 1,
	country: null,
	budget: 0,
	attachments: [
		{
			id: 3,
			postId: 8,
			number: 0,
			uri: 'https://traveltalesblob2025.blob.core.windows.net/attachments/post-8-9b4b6308-6273-4c83-aec6-a9e8040625e4.jpg',
			createdAt: '2025-05-20T22:15:06.3316757',
			modifiedAt: '2025-05-20T22:15:06.3316925',
			isDeleted: false,
		},
		{
			id: 12,
			postId: 8,
			number: 0,
			uri: 'https://traveltalesblob2025.blob.core.windows.net/attachments/post-8-fe2ff61f-5c80-46d8-bf65-29ce21e43d9f.jpg',
			createdAt: '2025-05-22T13:01:50.4502926',
			modifiedAt: '2025-05-22T13:01:50.4503301',
			isDeleted: false,
		},
	],
	likes: [
		{
			postId: 8,
			bloggerId: 15,
		},
		{
			postId: 8,
			bloggerId: 16,
		},
	],
	comments: [
		{
			id: 1,
			content: 'Hello!',
			postId: 8,
			post: null,
			bloggerId: 15,
			blogger: {
				id: 15,
				firstName: 'Iryna',
				lastName: 'Bibik',
				birthDate: '2011-09-03T00:00:00',
				sex: 1,
				bio: 'It works! ',
				image:
					'https://traveltalesblob2025.blob.core.windows.net/user-photos/iryna.bibik-nure.ua-9ec01b08-d163-4f93-ab57-6de83a386ac2.jpg',
				userId: '1becd495-1239-4af9-4a1e-08dd96ca458a',
				followerCount: 0,
				followingCount: 0,
				isFollowing: false,
				cityId: 59060,
				city: null,
				countryId: 214,
				country: null,
				posts: [],
				createdAt: '2025-05-19T15:30:00.3498964',
				modifiedAt: '2025-05-22T12:46:19.7819768',
				isDeleted: false,
			},
			createdAt: '2025-05-21T21:50:13.1696384',
			modifiedAt: '2025-05-21T21:50:13.1708079',
			isDeleted: false,
		},
		{
			id: 9,
			content: 'This is my comment',
			postId: 8,
			post: null,
			bloggerId: 1,
			blogger: null,
			createdAt: '2025-05-22T11:38:42.3160348',
			modifiedAt: '2025-05-22T11:38:42.3164409',
			isDeleted: false,
		},
		{
			id: 11,
			content: 'Hello',
			postId: 8,
			post: null,
			bloggerId: 1,
			blogger: null,
			createdAt: '2025-05-22T12:07:19.1958307',
			modifiedAt: '2025-05-22T12:07:19.1964849',
			isDeleted: false,
		},
		{
			id: 12,
			content: 'This is my comment',
			postId: 8,
			post: null,
			bloggerId: 16,
			blogger: null,
			createdAt: '2025-05-22T12:11:30.185343',
			modifiedAt: '2025-05-22T12:11:30.1853927',
			isDeleted: false,
		},
		{
			id: 13,
			content: 'Comment to delete',
			postId: 8,
			post: null,
			bloggerId: 16,
			blogger: null,
			createdAt: '2025-05-22T12:11:48.5537397',
			modifiedAt: '2025-05-22T12:11:48.5537488',
			isDeleted: false,
		},
	],
	tags: ['string'],
	createdAt: '2025-05-20T11:48:28.2889899',
	modifiedAt: '2025-05-21T20:11:49.4290867',
	isDeleted: false,
};
