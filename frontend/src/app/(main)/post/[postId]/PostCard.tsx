'use client';

import { useCategories } from '@/hooks/useCategories';
import { Badge } from '@/components/ui/badge';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, Heart, MessageCircle, Paperclip } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Post } from '@/types/types';
import { BudgetIndicator } from '@/components/Post/BudgetIndicator';
import UserAvatar from '@/components/UserAvatar';
import { redirect } from 'next/navigation';
import { useLocationInfo } from '@/hooks/useLocationInfo';
import { Skeleton } from '@/components/ui/skeleton';
import { CommentsSection } from '@/components/comments/Comments';
import { formatDate } from '@/lib/utils';

export function PostCard({ post }: { post: Post }) {
	const { data: categories, isLoading: categoriesLoading } = useCategories();
	const {
		cities,
		countries,
		loading: locationsLoading,
	} = useLocationInfo(post.countryId);
	const bloggerName = `${post.blogger.firstName} ${post.blogger.lastName}`;

	const getFileType = (uri: string) => {
		const extension = uri.split('.').pop()?.toLowerCase();
		if (!extension) return 'unknown';

		const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
		if (imageTypes.includes(extension)) return 'image';

		return extension;
	};

	if (categoriesLoading || locationsLoading) {
		return (
			<Card className='mx-auto'>
				<CardHeader className='space-y-4'>
					<Skeleton className='h-8 w-3/4' />
					<div className='flex items-center space-x-3'>
						<Skeleton className='h-10 w-10 rounded-full' />
						<Skeleton className='h-4 w-24' />
					</div>
					<div className='flex flex-wrap gap-2'>
						<Skeleton className='h-6 w-16' />
						<Skeleton className='h-6 w-16' />
					</div>
				</CardHeader>
				<CardContent>
					<Skeleton className='h-4 w-full' />
					<Skeleton className='mt-2 h-4 w-5/6' />
				</CardContent>
			</Card>
		);
	}

	const categoryMap = categories?.reduce(
		(acc, category) => {
			acc[category.id] = category.name;
			return acc;
		},
		{} as Record<number, string>,
	);

	const city = cities?.find(c => c.id === post.cityId);
	const country = countries?.find(c => c.id === post.countryId);

	return (
		<Card className='mx-auto'>
			<CardHeader className='space-y-4'>
				<div className='flex items-start justify-between'>
					<div className='space-y-1'>
						<h2 className='text-2xl font-bold'>{post.title}</h2>
						<div className='flex items-center space-x-2 text-sm text-muted-foreground'>
							<Calendar className='h-4 w-4' />
							<span>Posted: {formatDate(post.createdAt)}</span>
						</div>
					</div>

					{post.budget !== undefined && <BudgetIndicator level={post.budget} />}
				</div>

				<div className='flex w-full items-center justify-between'>
					<div className='flex items-center space-x-3'>
						<UserAvatar size={50} avatarUrl={post.blogger.image} />
						<div>
							<p
								className='font-medium hover:underline'
								onClick={() => redirect(`/blogger/${post.blogger.id}`)}
							>
								{bloggerName}
							</p>
						</div>
					</div>
					<Button
						variant={post.blogger.isFollowing ? 'default' : 'outline'}
						className='rounded-full px-5 py-1.5 text-sm font-medium'
					>
						{post.blogger.isFollowing ? 'Following' : 'Follow'}
					</Button>
				</div>

				<div className='flex flex-wrap gap-2'>
					{post.categoryIds?.map(categoryId => (
						<Badge
							key={categoryId}
							variant='secondary'
							className='bg-purple-100 text-purple-800 hover:bg-purple-200'
						>
							{categoryMap?.[categoryId] || `Category ${categoryId}`}
						</Badge>
					))}

					{city && (
						<Badge
							variant='outline'
							className='border-blue-200 bg-blue-50 text-blue-700'
						>
							<span className='mr-1'>📍</span>
							{city.name}
						</Badge>
					)}

					{country && (
						<Badge
							variant='outline'
							className='border-green-200 bg-green-50 text-green-700'
						>
							<span className='mr-1'>🌍</span>
							{country.name}
						</Badge>
					)}

					{post.tags?.map((tag, index) => (
						<Badge
							key={index}
							variant='outline'
							className='bg-gray-50 text-gray-700'
						>
							#{tag}
						</Badge>
					))}
				</div>
			</CardHeader>

			<CardContent className='space-y-6'>
				<div className='prose max-w-none'>
					<p>{post.content}</p>
				</div>

				{post.attachments?.map(attachment => {
					const fileType = getFileType(attachment.uri);

					return (
						<div key={attachment.id} className='space-y-3'>
							{fileType === 'image' ? (
								<div className='overflow-hidden rounded-md'>
									<Image
										src={attachment.uri}
										alt={`Attachment ${attachment.number}`}
										width={800}
										height={400}
										className='h-auto w-full object-cover'
									/>
								</div>
							) : (
								<div className='flex items-center space-x-3 rounded-md border p-3'>
									<Paperclip className='h-8 w-8 text-muted-foreground' />
									<div className='overflow-hidden'>
										<p className='truncate font-medium'>
											Attachment {attachment.number} ({fileType})
										</p>
										<Link
											href={attachment.uri}
											className='text-sm text-blue-600 hover:underline'
											target='_blank'
											rel='noopener noreferrer'
										>
											Download
										</Link>
									</div>
								</div>
							)}
						</div>
					);
				})}
			</CardContent>

			<Separator />

			<CardFooter className='flex flex-col space-y-4 pt-6'>
				<div className='flex w-full items-center justify-between'>
					<div className='flex items-center space-x-2'>
						<button className='flex items-center space-x-1 text-muted-foreground hover:text-foreground'>
							<Heart
								className={`h-5 w-5 ${post.likes?.length ? 'fill-red-500 text-red-500' : ''}`}
							/>
							<span>{post.likes?.length || 0}</span>
						</button>
						<button className='flex items-center space-x-1 text-muted-foreground hover:text-foreground'>
							<MessageCircle className='h-5 w-5' />
							<span>{post.comments?.length || 0}</span>
						</button>
					</div>
					<div className='text-sm text-muted-foreground'>
						{post.comments?.length || 0} comments
					</div>
				</div>
				{/* <CommentsSection  post={post} /> */}
				<CommentsSection post={post} />
			</CardFooter>
		</Card>
	);
}
