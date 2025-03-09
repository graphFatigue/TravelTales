import { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
	title: 'Log in',
};

export default function page() {
	return (
		<div>
			<LoginForm />
		</div>
	);
}
