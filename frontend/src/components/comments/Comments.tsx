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
import { useQueryClient } from '@tanstack/react-query';

export const CommentsSection = ({
	post,
	changeCommentsAmount,
}: {
	post: Post;
	changeCommentsAmount: React.Dispatch<React.SetStateAction<number>>;
}) => {
	const { data: session } = useSession();
	const { t, i18n } = useTranslation();
	const currentLanguage = i18n.language;
	const queryClient = useQueryClient();
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
		queryClient.invalidateQueries({
			queryKey: ['blogger', 'statistics', post.bloggerId],
		});
	};

	return (
		<div className='w-full space-y-3 sm:space-y-4'>
			{comments.length > 0 ? (
				<>
					{comments.map(comment => (
						<Card
							key={comment.id}
							className='overflow-hidden transition-all hover:shadow-md'
						>
							<CardContent className='p-3 sm:p-4'>
								<div className='flex items-start gap-2 sm:gap-3'>
									<UserAvatar 
										avatarUrl={comment.bloggerImage || ''} 
										size={32}
										className='sm:h-10 sm:w-10'
									/>
									<div className='flex-1 space-y-1 sm:space-y-1.5'>
										<div className='flex items-center justify-between'>
											<p className='text-xs sm:text-sm font-medium'>
												{comment.bloggerName || t('comments.deletedUser')}
											</p>
											<p className='text-[10px] sm:text-xs text-muted-foreground'>
												{formatDate(comment.createdAt, currentLanguage)}
											</p>
										</div>
										<p className='text-xs sm:text-sm text-foreground'>{comment.content}</p>
									</div>
								</div>
							</CardContent>

							{session && (
								<CommentsAction
									edit={edit}
									remove={remove}
									comment={comment}
									changeCommentsAmount={changeCommentsAmount}
									post={post}
								/>
							)}
						</Card>
					))}

					{hasNextPage && (
						<div className='flex justify-center pt-2 sm:pt-4'>
							<Button
								variant='outline'
								onClick={() => fetchNextPage()}
								disabled={isFetchingNextPage}
								className='h-8 text-xs sm:h-10 sm:text-sm'
							>
								{isFetchingNextPage ? (
									<>
										<Loader2 className='mr-1.5 h-3 w-3 animate-spin sm:mr-2 sm:h-4 sm:w-4' />
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
				<div className='py-6 sm:py-8 text-center'>
					<p className='text-xs sm:text-sm text-muted-foreground'>{t('comments.noCommentsYet')}</p>
				</div>
			)}

			{session ? (
				<div className='mt-6 sm:mt-8 space-y-3 sm:space-y-4'>
					<div className='mx-1 flex items-center gap-2 sm:gap-3'>
						<UserAvatar 
							avatarUrl={blogger?.image} 
							size={32}
							className='sm:h-10 sm:w-10'
						/>
						<Label htmlFor='comment' className='text-xs sm:text-sm font-medium'>
							{t('comments.addComment')}
						</Label>
					</div>

					<Textarea
						id='comment'
						placeholder={t('comments.placeholder')}
						value={content}
						onChange={e => setContent(e.target.value)}
						className='min-h-[80px] text-xs sm:min-h-[100px] sm:text-sm'
						maxLength={1000}
					/>

					<div className='flex justify-end'>
						<Button
							onClick={handleSend}
							disabled={!content.trim()}
							className='h-8 text-xs sm:h-10 sm:text-sm transition-all'
						>
							{t('comments.submit')}
						</Button>
					</div>
				</div>
			) : (
				<div className='mt-6 sm:mt-8 rounded-md border bg-muted/20 p-3 sm:p-4 text-center'>
					<p className='text-xs sm:text-sm text-muted-foreground'>{t('comments.pleaseSignIn')}</p>
				</div>
			)}
		</div>
	);
};
