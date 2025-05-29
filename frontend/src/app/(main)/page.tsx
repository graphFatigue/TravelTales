import { CreatePostButton } from '@/components/Post/CreatePostButton';
import PostsFeed from '@/components/Post/PostsFeed';
import { Suspense } from 'react';


export default async function Home() {
	return (
		<main className='h-[200vh] w-full'>
			<div className='w-full space-y-5'>
				<CreatePostButton />
				<Suspense fallback={<div>Loading posts...</div>}>
					<PostsFeed />
				</Suspense>
			</div>
		</main>
	);
}
