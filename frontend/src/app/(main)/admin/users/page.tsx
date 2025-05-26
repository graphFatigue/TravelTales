import { Suspense } from 'react';
import { UsersList } from './UsersList';
import UserFilterComponent from './UsersFilter';

type CustomPageProps = {
	searchParams: Promise<Record<string, string | undefined>>;
};

export default async function Page({ searchParams }: CustomPageProps) {
	const resolvedParams = await searchParams;

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
						field: resolvedParams.field || '',
						value: resolvedParams.value || '',
						page: resolvedParams.page || '',
					}}
				/>
			</Suspense>
		</div>
	);
}
