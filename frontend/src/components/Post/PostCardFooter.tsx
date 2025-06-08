'use client';

import { useState } from 'react';
import { CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Heart, Loader2, MessageCircle } from 'lucide-react';
import { CommentsSection } from '../comments/Comments';
import RestrictedDialog from '../RestrictedDialog';
import { useSession } from 'next-auth/react';
import { useLikes } from '@/hooks/posts/useLikes';
import { Post } from '@/types/types';
import { useTranslation } from 'react-i18next';

export function PostCardFooter({ post }: { post: Post }) {
	const { data: session, status } = useSession();
	const { t } = useTranslation();
	const [openComments, setOpenComments] = useState(false);
	const [openLikes, setOpenLikes] = useState(false);
	const [commentsAmount, setCommentsAmount] = useState<number>(
		post.comments?.length || 0,
	);

	const { likesCount, isLiked, toggleLike } = useLikes(
		post.id,
		post.likes?.length || 0,
		post.likes?.some(like => like.bloggerId === session?.user.blogger?.id) ||
			false,
	);

	if (status === 'loading')
		return (
			<div className='m-5 flex items-center gap-5 space-x-2 text-muted-foreground'>
				<Loader2 className='animate-spin' />
				{t('common.loading')}
			</div>
		);

	return (
		<CardFooter className='flex flex-col space-y-4 pt-6'>
			<div className='flex w-full items-center justify-between'>
				<div className='flex items-center space-x-2'>
					<Button
						onClick={() => {
							if (session) {
								toggleLike();
							} else {
								setOpenLikes(true);
							}
						}}
						variant='ghost'
						className='flex items-center space-x-1 text-muted-foreground hover:text-foreground'
					>
						<Heart
							className={`h-8 w-8 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
						/>
						<span className='text-base'>{likesCount}</span>
					</Button>
					<Button
						className='flex items-center space-x-1 text-muted-foreground hover:text-foreground'
						variant='ghost'
						onClick={() => setOpenComments(!openComments)}
					>
						<MessageCircle className='h-8 w-8' />
						<span className='text-base'>{commentsAmount}</span>
					</Button>
				</div>
				<div className='text-base text-muted-foreground'>
					{commentsAmount} {t('comments.title')}
				</div>
			</div>
			{openComments && <CommentsSection post={post} changeCommentsAmount={setCommentsAmount} />}
			{openLikes && (
				<RestrictedDialog open={openLikes} setOpen={setOpenLikes} />
			)}
		</CardFooter>
	);
}
