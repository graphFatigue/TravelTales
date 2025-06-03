'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BudgetIndicator } from '@/components/post/BudgetIndicator';
import UserAvatar from '@/components/user/UserAvatar';
import { redirect, useParams } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import PostAttachments from '@/components/post/PostAttachments';
import { PostCardFooter } from '@/components/post/PostCardFooter';
import { usePost } from '@/hooks/posts/usePost';
import PostLoader from '@/components/post/PostLoader';
import DeletePost from '@/components/post/DeletePost';
import { useSession } from 'next-auth/react';
import { useBlogger } from '@/hooks/bloggers/useBlogger';
import FollowButton from '@/components/follow/FollowButton';

export function PostCard() {
	const { postId } = useParams();
	const { data: post, isLoading, error } = usePost(Number(postId));
	const { data: session } = useSession();
	const { data: blogger } = useBlogger(post?.bloggerId, {
		initialData: post?.blogger,
	});

	if (isLoading) return <PostLoader />;

	if (error) return <div>Error loading post</div>;
	if (!post) return <div>Post not found</div>;
	if (!blogger) return <div>Blogger not found</div>;

	const bloggerName = `${blogger?.firstName} ${blogger?.lastName}`;

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
						<UserAvatar size={50} avatarUrl={blogger.image} />
						<div>
							<p
								className='font-medium hover:underline'
								onClick={() => redirect(`/blogger/${blogger.id}`)}
							>
								{bloggerName}
							</p>
						</div>
					</div>
					<div className='space-x-2'>
						{post.bloggerId === session?.user.blogger?.id && (
							<Button
								className='rounded-full bg-primary px-5 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90'
								onClick={() => redirect(`/post/${post.id}/edit`)}
							>
								Edit
							</Button>
						)}

						{(post.bloggerId === session?.user.blogger?.id ||
							session?.role === 'Admin') && (
							<DeletePost
								postId={post.id}
								className={
									'rounded-full bg-destructive px-5 py-1.5 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground'
								}
							/>
						)}
						{post.bloggerId !== session?.user.blogger?.id && (
							<FollowButton
								bloggerId={blogger?.id}
								isFollowing={blogger?.isFollowing}
							/>
						)}
					</div>
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
					variant='card'
					classname='my-4'
				/>
			</CardContent>

			<Separator />

			<PostCardFooter post={post} />
		</Card>
	);
}
