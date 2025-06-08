'use client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useComments } from '@/hooks/posts/useComments';
import { CreateComment, Post } from '@/types/types';
import { Card, CardContent } from '../ui/card';
import { formatDate } from '@/lib/utils';
import { Button } from '../ui/button';
import { CommentsAction } from './CommentsAction';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Loader2 } from 'lucide-react';
import UserAvatar from '../user/UserAvatar';
import { useBlogger } from '@/hooks/bloggers/useBlogger';
import { useTranslation } from 'react-i18next';

export const CommentsSection = ({
	post,
	changeCommentsAmount,
}: {
	post: Post;
	changeCommentsAmount: React.Dispatch<React.SetStateAction<number>>;
}) => {
	const { data: session } = useSession();
	const { t } = useTranslation();

	const { data: blogger } = useBlogger(session?.user.blogger?.id);

	const {
		comments,
		send,
		edit,
		remove,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useComments({
		postId: post.id,
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
		changeCommentsAmount(prev => prev + 1);
	};

	return (
		<div className='w-full space-y-4'>
			{comments.length > 0 ? (
				<>
					{comments.map(comment => (
						<Card
							key={comment.id}
							className='overflow-hidden transition-all hover:shadow-md'
						>
							<CardContent className='p-4'>
								<div className='flex items-start gap-3'>
									<UserAvatar avatarUrl={comment.bloggerImage || ''} />
									<div className='flex-1 space-y-1.5'>
										<div className='flex items-center justify-between'>
											<p className='text-sm font-medium'>
												{comment.bloggerName || 'Deleted User'}
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
								<CommentsAction
									edit={edit}
									remove={remove}
									comment={comment}
									changeCommentsAmount={changeCommentsAmount}
								/>
							)}
						</Card>
					))}

					{hasNextPage && (
						<div className='flex justify-center pt-4'>
							<Button
								variant='outline'
								onClick={() => fetchNextPage()}
								disabled={isFetchingNextPage}
							>
								{isFetchingNextPage ? (
									<>
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										{t('common.loading')}
									</>
								) : (
									<>{t('comments.moreComments')}</>
								)}
							</Button>
						</div>
					)}
				</>
			) : (
				<div className='py-8 text-center'>
					<p className='text-muted-foreground'>{t('comments.noCommentsYet')}</p>
				</div>
			)}

			{session ? (
				<div className='mt-8 space-y-4'>
					<div className='mx-1 flex items-center gap-3'>
						<UserAvatar avatarUrl={blogger?.image} />
						<Label htmlFor='comment' className='text-sm font-medium'>
							{t('comments.addComment')}
						</Label>
					</div>

					<Textarea
						id='comment'
						placeholder={t('comments.placeholder')}
						value={content}
						onChange={e => setContent(e.target.value)}
						className='min-h-[100px]'
						maxLength={1000}
					/>

					<div className='flex justify-end'>
						<Button
							onClick={handleSend}
							disabled={!content.trim()}
							className='transition-all'
						>
							{t('comments.submit')}
						</Button>
					</div>
				</div>
			) : (
				<div className='mt-8 rounded-md border bg-muted/20 p-4 text-center'>
					<p className='text-muted-foreground'>{t('comments.pleaseSignIn')}</p>
				</div>
			)}
		</div>
	);
};
