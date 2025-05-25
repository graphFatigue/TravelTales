"use client";

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
import { Textarea } from '@/components/ui/textarea';
import { CategoryFormValues, formSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';


interface CategoryFormProps {
	defaultValues?: Partial<CategoryFormValues>;
	onSubmit: (values: CategoryFormValues) => void;
	isSubmitting: boolean;
}

export function CategoryForm({
	defaultValues,
	onSubmit,
	isSubmitting,
}: CategoryFormProps) {
	const form = useForm<CategoryFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: defaultValues || {
			name: '',
			description: '',
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder='Category name' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='description'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea placeholder='Category description' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit' disabled={isSubmitting}>
					{isSubmitting ? 'Saving...' : 'Save'}
				</Button>
			</form>
		</Form>
	);
}
