import { Suspense } from 'react';
import BloggersPage from './BloggersPage';
import { Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const generateStaticParams = () => {
	return [];
};

export default function Page() {
	return (
		<div className='container mx-auto px-4 py-1'>
			<Suspense
				fallback={
					<div className='flex h-screen items-center justify-center'>
						<Loader2 className='h-12 w-12 animate-spin text-primary' />
					</div>
				}
			>
				<BloggersPage />
			</Suspense>
		</div>
	);
}
