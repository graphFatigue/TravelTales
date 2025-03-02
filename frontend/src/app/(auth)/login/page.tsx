import { Metadata } from 'next';
import Link from 'next/link';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
	title: 'Log in',
};

export default function page() {
	return (
		<div>
			<LoginForm />
			<Link href='/'>Home</Link>
		</div>
	);
}
