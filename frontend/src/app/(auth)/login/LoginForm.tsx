'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CardContent, CardFooter } from '@/components/ui/card';
import { signIn } from 'next-auth/react';
import GoogleButton from './GoogleButton';
import Link from 'next/link';

export default function LoginForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const result = await signIn('credentials', {
				redirect: false,
				email,
				password,
				callbackUrl: '/',
			});

			if (result?.error) {
				toast.error(result.error);
			} else {
				toast.success('Login successful!');
				router.push('/');
			}
		} catch {
			toast.error('An unexpected error occurred. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<CardContent className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='email'>Email</Label>
						<Input
							id='email'
							type='email'
							placeholder='name@example.com'
							value={email}
							onChange={e => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className='space-y-2'>
						<div className='flex items-center justify-between'>
							<Label htmlFor='password'>Password</Label>
							<Button
								variant='link'
								className='h-auto p-0 text-sm'
								type='button'
							>
								Forgot password?
							</Button>
						</div>
						<Input
							id='password'
							type='password'
							value={password}
							onChange={e => setPassword(e.target.value)}
							required
						/>
					</div>
				</CardContent>
				<CardFooter className='mt-5 flex flex-col'>
					<Button className='w-full' type='submit' disabled={isLoading}>
						{isLoading ? 'Logging in...' : 'Log in'}
					</Button>
					<div className='mt-4 text-center text-sm'>
						Don&apos;t have an account?{' '}
						<Link
							href={'/signup'}
							className='h-auto p-0 text-primary hover:underline'
						>
							Sign up
						</Link>
					</div>
					<div className='my-3 flex w-full items-center gap-3'>
						<div className='h-px flex-1 bg-black' />
						<span>OR</span>
						<div className='h-px flex-1 bg-black' />
					</div>
					<GoogleButton />
				</CardFooter>
			</form>
		</>
	);
}
