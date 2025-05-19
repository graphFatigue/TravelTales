'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { registrationSchema } from '@/lib/validation';
import api from '@/lib/api/api';

type RegistrationSchema = z.infer<typeof registrationSchema>;

export default function RegistrationForm() {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<RegistrationSchema>({
		resolver: zodResolver(registrationSchema),
	});
	const [isLoading, setIsLoading] = React.useState(false);
	const date = watch('birthDate');

	const onSubmit = async (data: RegistrationSchema) => {
		setIsLoading(true);

		try {
			await api.post('/api/Auth/signup', {
				...data,
				birthDate: date?.toISOString(),
			});

			const signInResponse = await signIn('credentials', {
				email: data.email,
				password: data.password,
				redirect: false,
			});

			if (signInResponse?.error) {
				toast.error(signInResponse?.error);
			} else {
				toast.success("You've successfully registered.");
				router.push('/');
			}
		} catch (err: unknown) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const error = err as any;
			toast.error(error.message.split(':')[1]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<CardContent className='space-y-4'>
				{/* First Name */}
				<div className='space-y-2'>
					<Label htmlFor='firstname'>First Name</Label>
					<Input id='firstname' placeholder='John' {...register('firstName')} />
					{errors.firstName && (
						<p className='text-sm text-red-500'>{errors.firstName.message}</p>
					)}
				</div>

				{/* Last Name */}
				<div className='space-y-2'>
					<Label htmlFor='lastname'>Last Name</Label>
					<Input id='lastname' placeholder='Doe' {...register('lastName')} />
					{errors.lastName && (
						<p className='text-sm text-red-500'>{errors.lastName.message}</p>
					)}
				</div>

				{/* Birth Date */}
				<div className='space-y-2'>
					<Label htmlFor='dob'>Date of Birth</Label>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant='outline'
								className={cn(
									'w-full justify-start text-left font-normal',
									!date && 'text-muted-foreground',
								)}
							>
								<CalendarIcon className='mr-2 h-4 w-4' />
								{date ? format(date, 'PPP') : 'Pick a date'}
							</Button>
						</PopoverTrigger>
						<PopoverContent className='w-auto p-0'>
							<Calendar
								mode='single'
								selected={date}
								onSelect={d => d && setValue('birthDate', d)}
								initialFocus
								disabled={d => d > new Date()}
							/>
						</PopoverContent>
					</Popover>
					{errors.birthDate && (
						<p className='text-sm text-red-500'>{errors.birthDate.message}</p>
					)}
				</div>

				{/* Email */}
				<div className='space-y-2'>
					<Label htmlFor='email'>Email</Label>
					<Input id='email' type='email' {...register('email')} />
					{errors.email && (
						<p className='text-sm text-red-500'>{errors.email.message}</p>
					)}
				</div>

				{/* Password */}
				<div className='space-y-2'>
					<Label htmlFor='password'>Password</Label>
					<Input id='password' type='password' {...register('password')} />
					{errors.password && (
						<p className='text-sm text-red-500'>{errors.password.message}</p>
					)}
					<p className='text-xs text-muted-foreground'>
						Password must be at least 6 characters long
					</p>
				</div>
			</CardContent>

			<CardFooter>
				<Button type='submit' className='w-full' disabled={isLoading}>
					{isLoading ? 'Signing up...' : 'Sign up'}
				</Button>
			</CardFooter>
		</form>
	);
}
