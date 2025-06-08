import Link from 'next/link';

export default function NotFound() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center rounded-md bg-white px-6'>
			<h1 className='mb-4 text-5xl font-bold text-red-500'>Post Not Found</h1>
			<p className='mb-6 max-w-md text-center text-lg text-gray-600'>
				Oops! The post you&apos;re looking for doesn’t exist or may have been
				removed.
			</p>
			<Link
				href='/'
				type='button'
				className='rounded-lg bg-primary px-6 py-3 text-lg text-white transition duration-300 hover:bg-primary/80'
			>
				Return Home
			</Link>
		</div>
	);
}
