'use client';

import { useSession } from 'next-auth/react';
import UserButton from './UserButton';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

export default function UserButtons() {
    const { data: session } = useSession();
    const router = useRouter();
	return (
		<>
			{session ? (
				<UserButton user={session.user} />
			) : (
				<div className='flex gap-4'>
					<Button variant='default' onClick={() => router.push('/login')}>
						Login
					</Button>
					<Button variant='outline' onClick={() => router.push('/signup')}>
						Sign Up
					</Button>
				</div>
			)}
		</>
	);
}
