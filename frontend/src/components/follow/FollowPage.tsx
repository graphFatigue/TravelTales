'use client';

import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import { Button } from '@/components/ui/button';
import { Loader2, Globe } from 'lucide-react';
import FollowBloggerCard from './FollowBloggerCard';
import { FollowBlogger } from '@/types/types';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { FollowBloggersResponse } from '@/hooks/bloggers/useInfiniteBloggers';
import { useTranslation } from 'react-i18next';

export default function FollowPage({
	followType,
	responseData,
}: {
	followType: 'following' | 'followers';
	responseData: UseInfiniteQueryResult<
		InfiniteData<FollowBloggersResponse, unknown>,
		Error
	>;
}) {
	const { t } = useTranslation();
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
	} = responseData;

	const bloggers =
		data?.pages.flatMap((page: { items: FollowBlogger[] }) => page.items) || [];

	if (isLoading) {
		return (
			<div className='flex h-screen items-center justify-center'>
				<Loader2 className='h-12 w-12 animate-spin text-primary' />
			</div>
		);
	}

	if (isError) throw new Error('Failed to load bloggers');

	return (
		<>
			<InfiniteScrollContainer
				onBottomReached={() =>
					hasNextPage && !isFetchingNextPage && fetchNextPage()
				}
				className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
			>
				{bloggers.map((blogger: FollowBlogger) => (
					<FollowBloggerCard
						key={
							followType === 'following'
								? blogger.followingId
								: blogger.followerId
						}
						blogger={blogger}
						followStatus={followType}
					/>
				))}

				{isFetchingNextPage && (
					<div className='col-span-full flex justify-center py-8'>
						<Loader2 className='h-8 w-8 animate-spin text-primary' />
					</div>
				)}

				{!hasNextPage && bloggers.length > 0 && (
					<div className='col-span-full py-8 text-center text-muted-foreground'>
						{t('bloggers.endReached')}
					</div>
				)}
			</InfiniteScrollContainer>

			{!isLoading && bloggers.length === 0 && (
				<div className='flex flex-col items-center justify-center gap-4 py-16'>
					<Globe className='h-12 w-12 text-muted-foreground' />
					<p className='text-lg text-muted-foreground'>{t('bloggers.noResults')}</p>
					<Button variant='outline'>{t('bloggers.refresh')}</Button>
				</div>
			)}
		</>
	);
}
