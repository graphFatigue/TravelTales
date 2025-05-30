import { Suspense } from 'react';
import FollowersPostsFeed from './FollowersPostsFeed';


export default async function Page() {
    return (
			<main className='h-[200vh] w-full'>
				<div className='w-full space-y-5'>
					<Suspense fallback={<div>Loading posts...</div>}>
						<FollowersPostsFeed />
					</Suspense>
				</div>
			</main>
		);
}
