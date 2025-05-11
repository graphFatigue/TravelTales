'use client';

import type React from 'react';

import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
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
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import axios from 'axios';
import https from 'https';

export default function RegistrationForm() {
	const [date, setDate] = useState<Date>();
	const [formData, setFormData] = useState({
		email: '',
		firstName: '',
		lastName: '',
		birthDate: '',
		password: '',
	});
	const [error, setError] = useState('');
	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		try {

			// optimize it
			await axios.post(
				'https://localhost:7132/api/Auth/signup',
				{
					...formData,
					birthDate: date?.toISOString(),
				},
				{
					headers: {
						'Content-Type': 'application/json',
					},
					httpsAgent: new https.Agent({ rejectUnauthorized: false }),
				},
			);

			const signInResponse = await signIn('credentials', {
				email: formData.email,
				password: formData.password,
				redirect: false,
			});

			if (signInResponse?.error) {
				router.push('/login');
			} else {
				toast("You've successfully registered.");
				router.push('/');
			}
		} catch (err: unknown) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const error = err as any;
			setError(error?.response?.data);
			console.log('Signup error:', err);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<CardContent className='space-y-4'>
				{error && <div className='error-message'>{error}</div>}
				<div className='space-y-2'>
					<Label htmlFor='firstname'>First Name</Label>
					<Input
						id='firstname'
						placeholder='John'
						required
						name='firstName'
						value={formData.firstName}
						onChange={handleChange}
					/>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='lastname'>Last Name</Label>
					<Input
						id='lastname'
						placeholder='Doe'
						name='lastName'
						value={formData.lastName}
						onChange={handleChange}
						required
					/>
				</div>

				{/* Date of Birth */}
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
								id='dob'
							>
								<CalendarIcon className='mr-2 h-4 w-4' />
								{date ? format(date, 'PPP') : 'Pick a date'}
							</Button>
						</PopoverTrigger>
						<PopoverContent className='w-auto p-0'>
							<Calendar
								mode='single'
								selected={date}
								onSelect={setDate}
								initialFocus
								disabled={date => date > new Date()}
							/>
						</PopoverContent>
					</Popover>
				</div>

				{/* Email */}
				<div className='space-y-2'>
					<Label htmlFor='email'>Email</Label>
					<Input
						id='email'
						type='email'
						name='email'
						value={formData.email}
						onChange={handleChange}
						placeholder='example@example.com'
						required
					/>
				</div>

				{/* Password */}
				<div className='space-y-2'>
					<Label htmlFor='password'>Password</Label>
					<Input
						id='password'
						type='password'
						required
						name='password'
						placeholder='*******'
						value={formData.password}
						onChange={handleChange}
					/>
					<p className='text-xs text-muted-foreground'>
						Password must be at least 8 characters long
					</p>
				</div>
			</CardContent>
			<CardFooter>
				<Button type='submit' className='w-full'>
					Register
				</Button>
			</CardFooter>
		</form>
	);
}
