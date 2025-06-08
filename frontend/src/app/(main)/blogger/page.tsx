import { Suspense } from 'react';
import BloggersPage from './BloggersPage';

export const dynamic = 'force-dynamic';

export const generateStaticParams = () => {
	return [];
};

export default function Page() {
	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='mb-8 text-center'>
				<h1 className='text-4xl font-bold tracking-tight'>Discover Bloggers</h1>
				<p className='mt-2 text-muted-foreground'>
					Connect with travel enthusiasts around the world
				</p>
			</div>
			<Suspense 
				fallback={
					<div className='flex h-screen items-center justify-center'>
						<div className='text-center'>
							<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
							<p className='mt-4 text-muted-foreground'>Loading bloggers...</p>
						</div>
					</div>
				}
			>
				<BloggersPage />
			</Suspense>
		</div>
	);
}
