import { Metadata } from 'next';
import LoginForm from './LoginForm';
import {
	Card,
} from '@/components/ui/card';
import Link from 'next/link';
import { X } from 'lucide-react';

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
				<LoginForm />
			</Card>
		</div>
	);
}
