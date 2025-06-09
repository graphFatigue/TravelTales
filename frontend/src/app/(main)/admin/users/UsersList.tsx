'use client';

import InfiniteScrollContainer from '@/components/InfiniteScrollContainer';
import { useUsers } from '@/hooks/users';
import { UserListItem } from './UserListItem';
import { UsersSkeleton } from '@/components/user/UserSkeleton';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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

	const { t } = useTranslation();

	const users = data?.pages.flatMap(page => page.items) || [];

	return (
		<div className='space-y-4'>
			{isLoading ? (
				<UsersSkeleton />
			) : error ? (
				<div className='text-center text-red-500'>{t('users.error')}</div>
			) : users.length === 0 ? (
				<div className='py-8 text-center text-muted-foreground'>
					{t('users.noResults')}
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
							{t('bloggers.endReached')}
						</div>
					)}
				</InfiniteScrollContainer>
			)}
		</div>
	);
}
