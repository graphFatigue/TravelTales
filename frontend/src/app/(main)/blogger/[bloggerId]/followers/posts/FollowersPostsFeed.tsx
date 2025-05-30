'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useInfinitePosts } from '@/hooks/posts/usePosts';
import PostLoader from '@/components/Post/PostLoader';
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import { PostCardPreview } from '@/components/Post/PostCardPreview';

export default function FollowersPostsFeed() {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
        useInfinitePosts();

    const posts = data?.pages.flatMap(page => page.items) || [];

    return (
			<div className='space-y-6'>
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
