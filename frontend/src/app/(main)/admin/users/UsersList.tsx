'use client';

import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import { useUsers } from '@/lib/api/users';
import { UserListItem } from './UserListItem';
import { UsersSkeleton } from '@/components/UserSkeleton';

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
	} = useUsers(backendFilters);

	return (
		<InfiniteScrollContainer
			onBottomReached={() => {
				if (hasNextPage && !isFetching) {
					fetchNextPage();
				}
			}}
			className='divide-y divide-gray-200'
		>
			{data?.pages.map(page =>
				page.items.map(user => <UserListItem key={user.id} user={user} />),
			)}
			{isFetching || isFetchingNextPage && (
				<div className='p-4 text-center text-gray-500'>
					Loading more users...
				</div>
			)}
			{isLoading && <UsersSkeleton />}
		</InfiniteScrollContainer>
	);
}
