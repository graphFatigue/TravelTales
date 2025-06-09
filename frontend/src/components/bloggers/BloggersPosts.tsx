'use client';
import { useInfiniteBloggerPosts } from '@/hooks/bloggers/useBloggerPosts';
import PostLoader from '../post/PostLoader';
import InfiniteScrollContainer from '../InfiniteScrollContainer';
import { PostCardPreview } from '../post/PostCardPreview';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function BloggersPosts({ bloggerId }: { bloggerId: number }) {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
		useInfiniteBloggerPosts({ bloggerId });
	const {t} = useTranslation();

	const posts = data?.pages.flatMap(page => page.items) || [];

	return (
		<div className='space-y-6'>
			{posts.length == 0 && status === 'success' && !hasNextPage && (
				<div className='text-center'>{t('profile.posts.noPosts')}</div>
			)}
			{status === 'pending' && <PostLoader />}
			<InfiniteScrollContainer
				className='space-y-5'
				onBottomReached={() =>
					hasNextPage && !isFetchingNextPage && fetchNextPage()
				}
			>
				{posts.map(post => (
					<PostCardPreview key={post.id} post={post} />
				))}
				{isFetchingNextPage && (
					<Loader2 className='mx-auto my-3 animate-spin' />
				)}
			</InfiniteScrollContainer>
		</div>
	);
}
