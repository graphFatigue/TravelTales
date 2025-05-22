
import PostsFeed from '@/components/PostsFeed';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Home() {
	return (
		<main className='h-[200vh] w-full'>
			<div className='w-full space-y-5'>
				<Link href='/post/new'>
					<Button>Create new post</Button>
				</Link>
				<PostsFeed />
			</div>
		</main>
	);
}
