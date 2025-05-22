'use client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useComments } from '@/hooks/useComments';
import { CreateComment, Post } from '@/types/types';
import { Card, CardContent } from '../ui/card';
import UserAvatar from '../UserAvatar';
import { formatDate } from '@/lib/utils';
import { Button } from '../ui/button';
import { CommentsAction } from './CommentsAction';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

export const CommentsSection = ({ post }: { post: Post }) => {
	const { data: session } = useSession();
	const { comments, send, edit, remove } = useComments({
		postId: post.id,
		initialComments: post.comments || [],
	});
	const [content, setContent] = useState('');

	const handleSend = async () => {
		if (!content.trim()) return;
		const comment: CreateComment = {
			content,
			postId: post.id,
			bloggerId: Number(session?.user.blogger?.id),
		};
		await send(comment);
		setContent('');
	};

	console.log(comments);

	return (
		<div>
			{comments.length > 0 ? (
				<div className='space-y-4'>
					{comments.map(comment => (
						<Card
							key={comment.id}
							className='overflow-hidden transition-all hover:shadow-md'
						>
							<CardContent className='p-4'>
								<div className='flex items-start gap-3'>
									<UserAvatar avatarUrl={comment.blogger?.image} />
									<div className='flex-1 space-y-1.5'>
										<div className='flex items-center justify-between'>
											<p className='text-sm font-medium'>
												{comment.blogger?.firstName || 'Anonymous'}
											</p>
											<p className='text-xs text-muted-foreground'>
												{formatDate(comment.createdAt)}
											</p>
										</div>
										<p className='text-sm text-foreground'>{comment.content}</p>
									</div>
								</div>
							</CardContent>

							{session && (
								<CommentsAction edit={edit} remove={remove} comment={comment} />
							)}
						</Card>
					))}
				</div>
			) : (
				<div className='py-8 text-center'>
					<p className='text-muted-foreground'>
						No comments yet. Be the first to comment!
					</p>
				</div>
			)}

			{session ? (
				<div className='mt-8 space-y-4'>
					<div className='flex items-center gap-3'>
						<UserAvatar avatarUrl={session.user.blogger?.image} />
						<Label htmlFor='comment' className='text-sm font-medium'>
							Add a comment
						</Label>
					</div>

					<Textarea
						id='comment'
						placeholder='Share your thoughts...'
						value={content}
						onChange={e => setContent(e.target.value)}
						className='min-h-[120px] resize-none'
					/>

					<div className='flex justify-end'>
						<Button
							onClick={handleSend}
							disabled={!content.trim()}
							className='transition-all'
						>
							Post Comment
						</Button>
					</div>
				</div>
			) : (
				<div className='mt-8 rounded-md border bg-muted/20 p-4 text-center'>
					<p className='text-muted-foreground'>
						Please sign in to leave a comment.
					</p>
				</div>
			)}
		</div>
	);
};
