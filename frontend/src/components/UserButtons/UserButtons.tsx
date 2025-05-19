'use client';

import { useSession } from 'next-auth/react';
import UserButton from './UserButton';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function UserButtons() {
	const { data: session } = useSession();
	return (
		<>
			{session ? (
				<UserButton user={session.user} />
			) : (
				<div className='flex gap-4'>
					<Button variant='default'>
						<Link href={'/login'}>Login</Link>
					</Button>
					<Button variant='outline'>
						<Link href={'/signup'}>Sign Up</Link>
					</Button>
				</div>
			)}
		</>
	);
}
