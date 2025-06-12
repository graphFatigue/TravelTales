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
	ForgotPasswordValues,
	getForgotPasswordFormSchema,
} from '@/lib/validation';
import { useTranslation } from 'react-i18next';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { X } from 'lucide-react';

export default function ForgotPasswordPage() {
	const { t } = useTranslation();
	const form = useForm<ForgotPasswordValues>({
		resolver: zodResolver(getForgotPasswordFormSchema(t)),
		defaultValues: {
			email: '',
		},
	});

	const mutation = useMutation({
		mutationFn: (email: string) => authService.forgotPassword(email),
		onSuccess: () => {
			toast.success(t('auth.resetPassword.emailSent'));
		},
		onError: (error: any) => {
			toast.error(error.message || t('auth.resetPassword.emailError'));
		},
	});

	const onSubmit = (values: ForgotPasswordValues) => {
		mutation.mutate(values.email);
	};

	return (
		<div className='flex min-h-screen items-center justify-center p-4'>
			<Card className='relative w-full max-w-md'>
				<Link href={'/login'} className='absolute right-5 top-5'>
					<X />
				</Link>
				<CardHeader>
					<CardTitle>{t('auth.resetPassword.title')}</CardTitle>
					<CardDescription>
						{t('auth.resetPassword.description')}
					</CardDescription>
				</CardHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardContent>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t('auth.email')}</FormLabel>
										<FormControl>
											<Input type='email' {...field} />
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
