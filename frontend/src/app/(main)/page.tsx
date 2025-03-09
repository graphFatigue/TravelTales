'use client';
import { redirect } from 'next/navigation';

export default function Home() {
	const user = JSON.parse(localStorage.getItem('user') || '{}');

	if (!user) {
		redirect('/login');
	}

	return (
		// <main className="h-[200vh] w-full bg-red-50">
		// 	<div className="w-full">
		// 		front page
		// 	</div>
		// </main>
		<div></div>
	);
}
