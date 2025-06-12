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
import {
	getResetPasswordFormSchema,
	ResetPasswordValues,
} from '@/lib/validation';
import { useTranslation } from 'react-i18next';

export default function ResetPasswordPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { t } = useTranslation();

	const form = useForm<ResetPasswordValues>({
		resolver: zodResolver(getResetPasswordFormSchema(t)),
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
			toast.success(t('auth.resetPassword.success'));
			router.push('/login');
		},
		onError: (error: any) => {
			toast.error(error.message || t('auth.resetPassword.error'));
		},
	});

	const onSubmit = (values: ResetPasswordValues) => {
		mutation.mutate({
			email: values.email,
			token: values.token,
			newPassword: values.newPassword,
		});
	};

	return (
		<div className='flex min-h-screen items-center justify-center p-4'>
			<Card className='w-full max-w-md'>
				<CardHeader>
					<CardTitle>{t('auth.resetPassword.title')}</CardTitle>
					<CardDescription>
						{t('auth.resetPassword.description')}
					</CardDescription>
				</CardHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardContent className='space-y-4'>
							<FormField
								control={form.control}
								name='newPassword'
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t('auth.resetPassword.newPassword')}</FormLabel>
										<FormControl>
											<Input type='password' {...field} />
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
										<FormLabel>
											{t('auth.resetPassword.confirmPassword')}
										</FormLabel>
										<FormControl>
											<Input type='password' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
						<CardFooter className='flex justify-between'>
							<Button type='submit' disabled={mutation.isPending}>
								{mutation.isPending
									? t('common.loading')
									: t('auth.resetPassword.submit')}
							</Button>
						</CardFooter>
					</form>
				</Form>
			</Card>
		</div>
	);
}
