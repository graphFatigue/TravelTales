import { Metadata } from 'next';
import LoginForm from './LoginForm';
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
		<div className='flex min-h-[80vh] items-center justify-center'>
			<Card className='w-full max-w-md'>
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
