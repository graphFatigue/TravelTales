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
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { authService } from '@/lib/api/auth';
import { toast } from 'sonner';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { resetPasswordFormSchema, ResetPasswordValues } from '@/lib/validation';



export default function ResetPasswordPage() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const form = useForm<ResetPasswordValues>({
		resolver: zodResolver(resetPasswordFormSchema),
		defaultValues: {
			email: searchParams.get('email') || '',
			token: searchParams.get('token') || '',
			newPassword: '',
			confirmPassword: '',
		},
	});

	useEffect(() => {
		if (searchParams.get('email')) {
			form.setValue('email', searchParams.get('email') || '');
		}
		if (searchParams.get('token')) {
			form.setValue('token', searchParams.get('token') || '');
		}
	}, [searchParams, form]);

	const mutation = useMutation({
		mutationFn: (data: { email: string; token: string; newPassword: string }) =>
			authService.resetPassword(data.email, data.token, data.newPassword),
		onSuccess: () => {
			toast.success('Password reset successfully');
			router.push('/login');
		},
		onError: (error: any) => {
			toast.error(error.message || 'Failed to reset password');
		},
	});

    const onSubmit = (values: ResetPasswordValues) => {
        console.log({
					email: values.email,
					token: values.token,
					newPassword: values.newPassword,
				});
		mutation.mutate({
			email: values.email,
			token: values.token,
			newPassword: values.newPassword,
		});
	};

	return (
		<div className='flex min-h-[80vh] items-center justify-center'>
			<Card className='relative w-full max-w-md'>
				<CardHeader>
					<CardTitle>Reset Password</CardTitle>
					<CardDescription>
						Enter your email to receive a password reset link
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
							<FormField
								control={form.control}
								name='newPassword'
								render={({ field }) => (
									<FormItem>
										<FormLabel>New Password</FormLabel>
										<FormControl>
											<Input
												placeholder='••••••••'
												type='password'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='confirmPassword'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<Input
												placeholder='••••••••'
												type='password'
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
								{mutation.isPending ? 'Resetting...' : 'Reset Password'}
							</Button>
						</form>
					</Form>
				</CardContent>

				<CardFooter>
					<div className='text-center text-sm'>
						<Link href='/login' className='text-primary hover:underline'>
							Back to login
						</Link>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
