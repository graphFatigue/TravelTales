/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registrationSchema } from '@/lib/validation';
import api from '@/lib/api/api';
import { useTranslation } from 'react-i18next';
import { BirthDateField } from '@/components/editProfile/BirthDateField';
import { Form } from '@/components/ui/form';
import { useState } from 'react';

type RegistrationSchema = z.infer<typeof registrationSchema>;

export default function RegistrationForm() {
	const router = useRouter();
	const form = useForm<RegistrationSchema>({
		resolver: zodResolver(registrationSchema),
	});
	const [isLoading, setIsLoading] = useState(false);
	const { t } = useTranslation();

	const onSubmit = async (data: RegistrationSchema) => {
		setIsLoading(true);

		try {
			await api.post('/api/Auth/signup', {
				...data,
				birthDate: data.birthDate,
			});

			const signInResponse = await signIn('credentials', {
				email: data.email,
				password: data.password,
				redirect: false,
			});

			if (signInResponse?.error) {
				toast.error(signInResponse?.error);
			} else {
				toast.success(t('auth.signupSuccess'));
				router.push('/');
			}
		} catch (error: any) {
			toast.error(error.message.split(':')[1]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<CardHeader className='space-y-1'>
				<CardTitle className='text-2xl font-bold'>
					{t('auth.signupTitle')}
				</CardTitle>
				<CardDescription>{t('auth.signupDescription')}</CardDescription>
			</CardHeader>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent className='space-y-4'>
						{/* First Name */}
						<div className='space-y-2'>
							<Label htmlFor='firstname'>{t('auth.firstName')}</Label>
							<Input
								id='firstname'
								placeholder='John'
								{...form.register('firstName')}
							/>
							{form.formState.errors.firstName && (
								<p className='text-sm text-red-500'>
									{form.formState.errors.firstName.message}
								</p>
							)}
						</div>

						{/* Last Name */}
						<div className='space-y-2'>
							<Label htmlFor='lastname'>{t('auth.lastName')}</Label>
							<Input
								id='lastname'
								placeholder='Doe'
								{...form.register('lastName')}
							/>
							{form.formState.errors.lastName && (
								<p className='text-sm text-red-500'>
									{form.formState.errors.lastName.message}
								</p>
							)}
						</div>

						{/* Birth Date - Using the new BirthDateField component */}
						<BirthDateField control={form.control} />

						{/* Email */}
						<div className='space-y-2'>
							<Label htmlFor='email'>{t('auth.email')}</Label>
							<Input id='email' type='email' {...form.register('email')} />
							{form.formState.errors.email && (
								<p className='text-sm text-red-500'>
									{form.formState.errors.email.message}
								</p>
							)}
						</div>

						{/* Password */}
						<div className='space-y-2'>
							<Label htmlFor='password'>{t('auth.password')}</Label>
							<Input
								id='password'
								type='password'
								{...form.register('password')}
							/>
							{form.formState.errors.password && (
								<p className='text-sm text-red-500'>
									{form.formState.errors.password.message}
								</p>
							)}
							<p className='text-xs text-muted-foreground'>
								{t('auth.passwordDescription')}
							</p>
						</div>
					</CardContent>

					<CardFooter>
						<Button type='submit' className='w-full' disabled={isLoading}>
							{isLoading ? t('auth.signuping') : t('auth.signup')}
						</Button>
					</CardFooter>
				</form>
			</Form>
		</>
	);
}
