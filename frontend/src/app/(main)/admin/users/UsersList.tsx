'use client';

import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import { useUsers } from '@/hooks/users';
import { UserListItem } from './UserListItem';
import { UsersSkeleton } from '@/components/user/UserSkeleton';
import { Loader2 } from 'lucide-react';

export function UsersList({ filters }: { filters: Record<string, string> }) {
	const backendFilters = {
		field: filters.field,
		value: filters.value,
	};

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isLoading,
		isFetchingNextPage,
		error,
	} = useUsers(backendFilters);

	const users = data?.pages.flatMap(page => page.items) || [];

	return (
		<div className='space-y-4'>
			{isLoading ? (
				<UsersSkeleton />
			) : error ? (
				<div className='text-center text-red-500'>Error loading users</div>
			) : users.length === 0 ? (
				<div className='py-8 text-center text-muted-foreground'>
					No users found
				</div>
			) : (
				<InfiniteScrollContainer
					onBottomReached={() => {
						if (hasNextPage && !isFetching && !isFetchingNextPage) {
							fetchNextPage();
						}
					}}
					className='divide-y divide-gray-200'
				>
					{users.map(user => (
						<UserListItem key={user.id} user={user} />
					))}

					{isFetchingNextPage && (
						<div className='flex justify-center p-4'>
							<Loader2 className='h-6 w-6 animate-spin' />
						</div>
					)}

					{!hasNextPage && users.length > 0 && (
						<div className='py-4 text-center text-sm text-muted-foreground'>
							You&apos;ve reached the end
						</div>
					)}
				</InfiniteScrollContainer>
			)}
		</div>
	);
}
