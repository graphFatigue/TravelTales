'use client';

import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import { Button } from '@/components/ui/button';
import { Loader2, Globe } from 'lucide-react';
import { useInfiniteBloggers } from '@/hooks/bloggers/useInfiniteBloggers';
import BloggerCard from './BloggerCard';

export default function BloggersPage() {
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
	} = useInfiniteBloggers();

	const bloggers = data?.pages.flatMap(page => page.items) || [];

	if (isLoading) {
		return (
			<div className='flex h-screen items-center justify-center'>
				<Loader2 className='h-12 w-12 animate-spin text-primary' />
			</div>
		);
	}

	if (isError) {
		return (
			<div className='flex h-screen items-center justify-center'>
				<p className='text-destructive'>Failed to load bloggers</p>
			</div>
		);
	}

	return (
		<>
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

				{/* {!hasNextPage && bloggers.length > 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            You&apos;ve reached the end
          </div>
        )} */}
			</InfiniteScrollContainer>

			{!isLoading && bloggers.length === 0 && (
				<div className='flex flex-col items-center justify-center gap-4 py-16'>
					<Globe className='h-12 w-12 text-muted-foreground' />
					<p className='text-lg text-muted-foreground'>No bloggers found</p>
					<Button variant='outline'>Refresh</Button>
				</div>
			)}
		</>
	);
}
