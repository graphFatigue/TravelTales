'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className='flex min-h-screen flex-col items-center justify-center bg-white px-6'>
			<h1 className='mb-4 text-5xl font-bold text-red-500'>
				Oops... Something went wrong
			</h1>
			<p className='mb-6 max-w-md text-center text-lg text-gray-600'>
				An unexpected error occurred. Please try again later.
			</p>
			<div className='flex space-x-4'>
				<button
					onClick={() => reset()}
					className='rounded-lg border-2 border-primary bg-secondary px-6 py-3 text-lg text-primary transition hover:bg-secondary/80 hover:text-primary/80'
				>
					Try Again
				</button>
				<Link
					href='/'
					className='rounded-lg bg-primary px-6 py-3 text-lg text-white transition hover:bg-primary/80'
				>
					Go Home
				</Link>
			</div>
		</div>
	);
}
