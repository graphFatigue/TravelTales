import { Suspense } from 'react';
import { UsersList } from './UsersList';
import UserFilterComponent from './UsersFilter';
import { UsersSkeleton } from '@/components/user/UserSkeleton';

type CustomPageProps = {
	searchParams: Promise<Record<string, string | undefined>>;
};

export default async function Page({ searchParams }: CustomPageProps) {
	const resolvedParams = await searchParams;

	return (
		<div className='container mx-auto py-8'>
			<div className='mb-6'>
				<UserFilterComponent />
			</div>
			<Suspense fallback={<UsersSkeleton/>}>
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
