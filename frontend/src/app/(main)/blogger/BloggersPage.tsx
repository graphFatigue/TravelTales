'use client';

import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import { Button } from '@/components/ui/button';
import { Loader2, Globe } from 'lucide-react';
import { useInfiniteBloggers } from '@/hooks/bloggers/useInfiniteBloggers';
import BloggerCard from './BloggerCard';
import SearchBloggers from '@/components/bloggers/SearchBlogger';
import { useSearchParams } from 'next/navigation';
import { memo } from 'react';

const BloggersPage = () => {
	const searchParams = useSearchParams();
	const searchTerm = searchParams.get('s') || '';

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
		refetch,
	} = useInfiniteBloggers(6, searchTerm);

	const bloggers = data?.pages.flatMap(page => page.items) || [];

	if (isError) {
		return (
			<div className='flex h-screen items-center justify-center'>
				<p className='text-destructive'>Failed to load bloggers</p>
				<Button variant='outline' onClick={() => refetch()} className='ml-4'>
					Retry
				</Button>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<SearchBloggers
				onSearch={() => {}}
				initialValue={searchTerm}
			/>

			{isLoading ? (
				<div className='flex h-screen items-center justify-center'>
					<Loader2 className='h-12 w-12 animate-spin text-primary' />
				</div>
			) : (
				<InfiniteScrollContainer
					onBottomReached={() =>
						hasNextPage && !isFetchingNextPage && fetchNextPage()
					}
					className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
				>
					{bloggers.map(blogger => (
						<BloggerCard key={blogger.id} blogger={blogger} />
					))}

					{isFetchingNextPage && (
						<div className='col-span-full flex justify-center py-8'>
							<Loader2 className='h-8 w-8 animate-spin text-primary' />
						</div>
					)}

					{!hasNextPage && bloggers.length > 0 && (
						<div className='col-span-full py-8 text-center text-muted-foreground'>
							You&apos;ve reached the end
						</div>
					)}
				</InfiniteScrollContainer>
			)}

			{!isLoading && bloggers.length === 0 && (
				<div className='flex flex-col items-center justify-center gap-4 py-16'>
					<Globe className='h-12 w-12 text-muted-foreground' />
					<p className='text-lg text-muted-foreground'>
						{searchTerm
							? `No bloggers found for "${searchTerm}"`
							: 'No bloggers found'}
					</p>
					<Button variant='outline' onClick={() => refetch()}>
						Refresh
					</Button>
				</div>
			)}
		</div>
	);
};

export default memo(BloggersPage);
