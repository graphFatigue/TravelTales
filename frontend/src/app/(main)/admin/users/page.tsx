import { Suspense } from 'react';
import { UsersList } from './UsersList';
import UserFilterComponent from './UsersFilter';

export default function Page({
	searchParams,
}: {
	searchParams: Record<string, string>;
}) {
	return (
		<div className='container mx-auto py-8'>
			<div className='mb-6 flex items-center justify-between'>
				<h1 className='text-2xl font-bold'>Users Management</h1>
			</div>
			<div className='mb-6'>
				<UserFilterComponent />
			</div>
			<Suspense fallback={<div>Loading users...</div>}>
				<UsersList
					filters={{
						field: searchParams.field,
						value: searchParams.value,
						page: searchParams.page,
					}}
				/>
			</Suspense>
		</div>
	);
}
