'use client';

import React from 'react';
import { PostCardPreview } from './PostCardPreview';
import InfiniteScrollContainer from '../InfiniteScrollContainer';
import { Loader2 } from 'lucide-react';
import PostLoader from './PostLoader';
import { useInfinitePosts } from '@/hooks/posts/usePosts';
import { PostsFilter } from './PostsFilter';

export default function PostsFeed() {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
		useInfinitePosts();

	const posts = data?.pages.flatMap(page => page.items) || [];

	return (
		<div className='space-y-6'>
			<PostsFilter />
			{posts.length == 0 && status === 'success' && !hasNextPage && (
				<div className='text-center'>No posts found.</div>
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
				{!hasNextPage && posts.length > 0 && (
					<div className='col-span-full py-8 text-center text-muted-foreground'>
						You&apos;ve reached the end
					</div>
				)}
			</InfiniteScrollContainer>
		</div>
	);
}
