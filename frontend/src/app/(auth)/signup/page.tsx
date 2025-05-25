import { Metadata } from 'next';
import SignUpForm from './SignUpForm';
import {
	Card
} from '@/components/ui/card';
import { X } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Sign up',
};

export default function page() {
	return (
		<div className='flex min-h-screen items-center justify-center p-4'>
			<Card className='relative w-full max-w-md'>
				<Link href={'/'} className='absolute right-5 top-5'>
					<X />
				</Link>
				<SignUpForm />
			</Card>
		</div>
	);
}
