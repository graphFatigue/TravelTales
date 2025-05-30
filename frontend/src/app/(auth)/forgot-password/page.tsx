/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { authService } from '@/lib/api/auth';
import { toast } from 'sonner';
import {
	forgotPasswordFormSchema,
	forgotPasswordValues,
} from '@/lib/validation';

export default function ForgotPasswordPage() {
	const form = useForm<forgotPasswordValues>({
		resolver: zodResolver(forgotPasswordFormSchema),
		defaultValues: {
			email: '',
		},
	});

	const mutation = useMutation({
		mutationFn: (email: string) => authService.forgotPassword(email),
		onSuccess: () => {
			toast.success('Email sent successfully');
		},
		onError: (error: any) => {
			toast.error(error.message || 'Failed to send reset email');
		},
	});

	const onSubmit = (values: forgotPasswordValues) => {
		mutation.mutate(values.email);
	};

	return (
		<div className='flex min-h-screen items-center justify-center p-4'>
			<div className='w-full max-w-md space-y-8 rounded-lg border p-6 shadow-lg'>
				<div className='text-center'>
					<h1 className='text-2xl font-bold'>Forgot Password</h1>
					<p className='mt-2 text-sm text-muted-foreground'>
						Enter your email to receive a password reset link
					</p>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											placeholder='your@email.com'
											type='email'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type='submit'
							className='w-full'
							disabled={mutation.isPending}
						>
							{mutation.isPending ? 'Sending...' : 'Send Reset Link'}
						</Button>
					</form>
				</Form>

				<div className='text-center text-sm'>
					<Link href='/login' className='text-primary hover:underline'>
						Back to login
					</Link>
				</div>
			</div>
		</div>
	);
}
