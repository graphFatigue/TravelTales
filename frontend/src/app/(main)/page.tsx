import { CreatePostButton } from '@/components/post/CreatePostButton';
import PostLoader from '@/components/post/PostLoader';
import PostsFeed from '@/components/post/PostsFeed';
import { Suspense } from 'react';

export default function Home() {
	return (
		<main className='h-[200vh] w-full'>
			<div className='w-full space-y-5'>
				<CreatePostButton />
				<Suspense
					fallback={
						<div>
							<PostLoader />
						</div>
					}
				>
					<PostsFeed />
				</Suspense>
			</div>
		</main>
	);
}
