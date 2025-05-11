import { Metadata } from 'next';
import SignUpForm from './SignUpForm';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

export const metadata: Metadata = {
	title: 'Log in',
};

export default function page() {
	return (
		<div className='flex min-h-screen items-center justify-center p-4'>
			<Card className='w-full max-w-md'>
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
