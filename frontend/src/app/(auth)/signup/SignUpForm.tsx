'use client';

import type React from 'react';

import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { redirect } from 'next/navigation';

export default function RegistrationForm() {
	const [date, setDate] = useState<Date>();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle form submission
		localStorage.setItem(
			'user',
			JSON.stringify({
				email: 'example@gmail.com',
				password: '12345',
				username: 'unknown',
			})
		);
		toast("You've successfully registered.");
		redirect('/');
	};

	return (
		<div className="flex justify-center items-center min-h-screen p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold">
						Create an account
					</CardTitle>
					<CardDescription>
						Enter your information to register
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						{/* Full Name */}
						<div className="space-y-2">
							<Label htmlFor="fullname">Full Name</Label>
							<Input
								id="fullname"
								placeholder="John Doe"
								required
							/>
						</div>

						{/* Gender */}
						<div className="space-y-2">
							<Label htmlFor="gender">Gender</Label>
							<Select required>
								<SelectTrigger id="gender">
									<SelectValue placeholder="Select gender" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="male">Male</SelectItem>
									<SelectItem value="female">
										Female
									</SelectItem>
									<SelectItem value="non-binary">
										Non-binary
									</SelectItem>
									<SelectItem value="other">Other</SelectItem>
									<SelectItem value="prefer-not-to-say">
										Prefer not to say
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Date of Birth */}
						<div className="space-y-2">
							<Label htmlFor="dob">Date of Birth</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className={cn(
											'w-full justify-start text-left font-normal',
											!date && 'text-muted-foreground'
										)}
										id="dob"
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{date
											? format(date, 'PPP')
											: 'Pick a date'}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<Calendar
										mode="single"
										selected={date}
										onSelect={setDate}
										initialFocus
										disabled={(date) => date > new Date()}
									/>
								</PopoverContent>
							</Popover>
						</div>

						{/* Location */}
						<div className="space-y-2">
							<Label htmlFor="location">Location</Label>
							<Input
								id="location"
								placeholder="Enter your location"
								required
							/>
						</div>

						{/* Email */}
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="example@example.com"
								required
							/>
						</div>

						{/* Password */}
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input id="password" type="password" required />
							<p className="text-xs text-muted-foreground">
								Password must be at least 8 characters long
							</p>
						</div>
					</CardContent>
					<CardFooter>
						<Button type="submit" className="w-full">
							Register
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
