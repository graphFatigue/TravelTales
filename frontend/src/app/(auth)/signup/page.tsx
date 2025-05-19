import { Metadata } from 'next';
import SignUpForm from './SignUpForm';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { X } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Log in',
};

export default function page() {
	return (
		<div className='flex min-h-screen items-center justify-center p-4'>
			<Card className='relative w-full max-w-md'>
				<Link href={'/'} className='absolute right-5 top-5'>
					<X />
				</Link>
				<CardHeader className='space-y-1'>
					<CardTitle className='text-2xl font-bold'>
						Create an account
					</CardTitle>
					<CardDescription>Enter your information to register</CardDescription>
				</CardHeader>
				<SignUpForm />
			</Card>
		</div>
	);
}
