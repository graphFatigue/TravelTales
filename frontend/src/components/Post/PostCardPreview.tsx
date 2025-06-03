import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar } from 'lucide-react';
import type { Post } from '@/types/types';
import { BudgetIndicator } from '@/components/post/BudgetIndicator';
import UserAvatar from '@/components/user/UserAvatar';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import PostAttachments from './PostAttachments';
import { PostCardFooter } from './PostCardFooter';

export function PostCardPreview({ post }: { post: Post }) {
	const displayedCategories = post.categories?.slice(0, 3) || [];
	const remainingCategories =
		(post.categories?.length || 0) - displayedCategories.length;

	const displayedTags = post.tags?.slice(0, 3) || [];
	const remainingTags = (post.tags?.length || 0) - displayedTags.length;

	const displayedAttachments = post.attachments?.slice(0, 3) || [];
	const remainingAttachments =
		(post.attachments?.length || 0) - displayedAttachments.length;

	const truncatedContent =
		post.content?.length > 150
			? `${post.content.substring(0, 300)}...`
			: post.content;

	return (
		<Card className='mx-auto'>
			<CardHeader className='space-y-4'>
				<div className='flew-wrap flex items-start justify-between'>
					<div className='flex items-center gap-3'>
						<Link href={`/blogger/${post.blogger.id}`}>
							<UserAvatar size={40} avatarUrl={post.blogger.image} />
						</Link>
						<Link href={`/post/${post.id}`}>
							<h2 className='text-2xl font-bold hover:text-primary hover:underline'>
								{post.title}
							</h2>
						</Link>
					</div>

					{post.budget !== undefined && <BudgetIndicator level={post.budget} />}
				</div>

				<div className='flex flex-wrap gap-2'>
					{displayedCategories.map(category => (
						<Badge
							key={category.id}
							variant='secondary'
							className='bg-purple-100 text-purple-800 hover:bg-purple-200'
						>
							{category.name}
						</Badge>
					))}
					{remainingCategories > 0 && (
						<Badge variant='outline' className='bg-purple-50 text-purple-800'>
							+{remainingCategories} more
						</Badge>
					)}

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

					{displayedTags.map((tag, index) => (
						<Badge
							key={index}
							variant='outline'
							className='bg-gray-50 text-gray-700'
						>
							#{tag}
						</Badge>
					))}
					{remainingTags > 0 && (
						<Badge variant='outline' className='bg-gray-50 text-gray-700'>
							+{remainingTags} more
						</Badge>
					)}
				</div>
			</CardHeader>

			<CardContent className='space-y-4'>
				<div className='prose max-w-none'>
					<p>
						{truncatedContent}{' '}
						{post.content?.length > 150 && (
							<Link
								href={`/post/${post.id}`}
								className='display-inline text-sm text-primary hover:underline'
							>
								read more
							</Link>
						)}
					</p>
				</div>

				{post.attachments && post.attachments.length > 0 && (
					<div className='flex gap-3 flex-wrap'>
						<PostAttachments
							attachments={displayedAttachments}
							variant='preview'
							classname='flex gap-2 overflow-x-auto'
						/>
						{remainingAttachments > 0 && (
							<div className='relative flex h-[90px] min-w-[160px] flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100'>
								<span className='font-medium text-gray-600'>
									+{remainingAttachments} more
								</span>
							</div>
						)}
					</div>
				)}

				<div className='mt-4 flex items-center space-x-2 text-sm text-muted-foreground'>
					<Calendar className='h-4 w-4' />
					<span>Posted: {formatDate(post.createdAt)}</span>
				</div>
			</CardContent>

			<Separator />

			<PostCardFooter post={post} />
		</Card>
	);
}
