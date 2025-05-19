import { Metadata } from 'next';
import LoginForm from './LoginForm';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { X } from 'lucide-react';

export const metadata: Metadata = {
	title: 'Log in',
};

export default function page() {
	return (
		<div className='flex min-h-[80vh] items-center justify-center'>
			<Card className='relative w-full max-w-md'>
				<Link href={'/'} className='absolute right-5 top-5'>
					<X />
				</Link>
				<CardHeader className='space-y-1'>
					<CardTitle className='text-2xl font-bold'>Login</CardTitle>
					<CardDescription>
						Enter your email and password to access your account
					</CardDescription>
				</CardHeader>
				<LoginForm />
			</Card>
		</div>
	);
}
