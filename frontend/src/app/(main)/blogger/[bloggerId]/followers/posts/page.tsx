import { Suspense } from 'react';
import FollowersPostsFeed from './FollowersPostsFeed';
import PostLoader from '@/components/post/PostLoader';


export default async function Page() {
    return (
			<main className='h-[200vh] w-full'>
				<div className='w-full space-y-5'>
					<Suspense fallback={<PostLoader/>}>
						<FollowersPostsFeed />
					</Suspense>
				</div>
			</main>
		);
}
