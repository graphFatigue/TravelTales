'use client';

import React from 'react';
import { PostCardPreview } from './Post/PostCardPreview';
import { Post } from '@/types/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import api from '@/lib/api/api';
import InfiniteScrollContainer from './InfiniteScrollContainer';
import { Loader2 } from 'lucide-react';
import PostLoader from './Post/PostLoader';

interface PostsResponse {
	items: Post[];
	currentPage: number;
	totalPages: number;
	pageSize: number;
	totalCount: number;
	hasPrevious: boolean;
	hasNext: boolean;
}

export default function PostsFeed() {
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
		status,
	} = useInfiniteQuery({
		queryKey: ['posts', 'for-you'],
		queryFn: async ({ pageParam }) => {
			const response = await api.get<PostsResponse>('api/Posts/filter', {
				params: {
					page: pageParam || 1,
					pageSize: 3,
				},
			});
			return response.data;
		},
		initialPageParam: 1,
		getNextPageParam: lastPage => {
			return lastPage.hasNext ? lastPage.currentPage + 1 : undefined;
		},
	});

	const posts = data?.pages.flatMap(page => page.items) || [];

	if (status === 'pending') {
		return <PostLoader />;
	}

	if (status === 'success' && !posts.length && !hasNextPage) {
		return <p className='text-center text-muted'>No posts found.</p>;
	}

	if (status === 'error') {
		return (
			<p className='text-center text-destructive'>
				An error occurred when loading posts
			</p>
		);
	}

	return (
		<InfiniteScrollContainer
			className='space-y-5'
			onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
		>
			{posts.map(post => (
				<PostCardPreview key={post.id} post={post} />
			))}
			{isFetchingNextPage && <Loader2 className='mx-auto my-3 animate-spin' />}
		</InfiniteScrollContainer>
	);
}
