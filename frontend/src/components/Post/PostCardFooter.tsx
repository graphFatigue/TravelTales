'use client';

import React, { useState } from 'react';
import { CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Heart, MessageCircle } from 'lucide-react';
import { CommentsSection } from '../comments/Comments';
import RestrictedDialog from '../RestrictedDialog';
import { useSession } from 'next-auth/react';
import { useLikes } from '@/hooks/useLikes';
import { Post } from '@/types/types';

export function PostCardFooter({ post }: { post: Post }) {
	const { data: session } = useSession();
	const [openComments, setOpenComments] = useState(false);
	const [openLikes, setOpenLikes] = useState(false);

	const { likesCount, isLiked, toggleLike } = useLikes(
		post.id,
		post.likes?.length || 0,
		post.likes?.some(like => like.bloggerId === session?.user.blogger?.id) ||
			false,
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
							className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
						/>
						<span>{likesCount}</span>
					</Button>
					<Button
						className='flex items-center space-x-1 text-muted-foreground hover:text-foreground'
						variant='ghost'
						onClick={() => setOpenComments(!openComments)}
					>
						<MessageCircle className='h-5 w-5' />
						<span>{post.comments?.length || 0}</span>
					</Button>
				</div>
				<div className='text-sm text-muted-foreground'>
					{post.comments?.length || 0} comments
				</div>
			</div>
			{openComments && <CommentsSection post={post} />}
			{openLikes && (
				<RestrictedDialog open={openLikes} setOpen={setOpenLikes} />
			)}
		</CardFooter>
	);
}
