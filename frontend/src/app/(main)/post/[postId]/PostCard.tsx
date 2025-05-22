'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Post } from '@/types/types';
import { BudgetIndicator } from '@/components/Post/BudgetIndicator';
import UserAvatar from '@/components/UserAvatar';
import { redirect } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import PostAttachments from '@/components/Post/PostAttachments';
import { PostCardFooter } from '@/components/Post/PostCardFooter';

export function PostCard({ post }: { post: Post }) {
	const bloggerName = `${post.blogger.firstName} ${post.blogger.lastName}`;

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
					{post.city && (
						<Badge
							variant='outline'
							className='border-blue-200 bg-blue-50 text-blue-700'
						>
							<span className='mr-1'>📍</span>
							{post.city.name}
						</Badge>
					)}

					{post.country && (
						<Badge
							variant='outline'
							className='border-green-200 bg-green-50 text-green-700'
						>
							<span className='mr-1'>🌍</span>
							{post.country.name}
						</Badge>
					)}

					{post.categories?.map(categorie => (
						<Badge
							key={categorie.id}
							variant='secondary'
							className='bg-purple-100 text-purple-800 hover:bg-purple-200'
						>
							{categorie.name}
						</Badge>
					))}

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

				<PostAttachments
					attachments={post.attachments}
					width={400}
					height={200}
				/>
			</CardContent>

			<Separator />

			<PostCardFooter post={post} />
		</Card>
	);
}
