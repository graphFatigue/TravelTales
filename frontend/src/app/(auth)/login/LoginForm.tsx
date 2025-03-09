'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast} from 'sonner';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { redirect } from 'next/navigation';

export default function LoginForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		localStorage.setItem(
			'user',
			JSON.stringify({
				email,
				password,
				username: email.split('@')[0],
			})
		);
		toast("You've successfully logged in.");
		redirect('/');

		// try {

		// } catch {
		// 	toast('Please check your credentials and try again.');
		// } finally {
		// 	setIsLoading(false);
		// }
	};

	return (
		<div className="flex min-h-[80vh] items-center justify-center">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold">Login</CardTitle>
					<CardDescription>
						Enter your email and password to access your account
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="name@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="password">Password</Label>
								<Button
									variant="link"
									className="h-auto p-0 text-sm"
									type="button"
								>
									Forgot password?
								</Button>
							</div>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
					</CardContent>
					<CardFooter className="flex flex-col mt-5">
						<Button
							className="w-full"
							type="submit"
							disabled={isLoading}
							onClick={handleSubmit}
						>
							{isLoading ? 'Logging in...' : 'Log in'}
						</Button>
						<div className="mt-4 text-center text-sm">
							Don&apos;t have an account?{' '}
							<Button
								variant="link"
								className="h-auto p-0"
								type="button"
								onClick={() => redirect('/signup')}
							>
								Sign up
							</Button>
						</div>
					</CardFooter>
				</form>
			</Card>
			
		</div>
	);
}
