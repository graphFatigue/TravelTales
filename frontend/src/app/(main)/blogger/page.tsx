import { Suspense } from 'react';
import BloggersPage from './BloggersPage';

export default function Page() {
	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='mb-8 text-center'>
				<h1 className='text-4xl font-bold tracking-tight'>Discover Bloggers</h1>
				<p className='mt-2 text-muted-foreground'>
					Connect with travel enthusiasts around the world
				</p>
			</div>
			<Suspense fallback={<div>Loading bloggers...</div>}>
				<BloggersPage />
			</Suspense>
		</div>
	);
}
