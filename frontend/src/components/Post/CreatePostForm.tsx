'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCategories } from '@/hooks/useCategories';
import { useLocationInfo } from '@/hooks/useLocationInfo';
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BudgetIndicator } from './BudgetIndicator';
import { Plus, Trash, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { postFormSchema, PostFormValues } from '@/lib/validation';
import api from '@/lib/api/api';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export function CreatePostForm() {
	const { data: session } = useSession();
	const bloggerId = session?.user.blogger?.id;
	const router = useRouter();
	const { data: categories } = useCategories();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<PostFormValues>({
		resolver: zodResolver(postFormSchema),
		defaultValues: {
			title: '',
			content: '',
			bloggerId,
			budget: 0,
			categoryIds: [],
			tags: [],
			attachments: [],
		},
	});

	const countryId = form.watch('countryId');
	const { countries, cities } = useLocationInfo(countryId);

	const { watch, setValue } = form;
	const currentAttachments = watch('attachments');

	const handleFileChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>, index: number) => {
			const file = e.target.files?.[0];
			if (!file) return;

			const reader = new FileReader();
			reader.onloadend = () => {
				const updatedAttachments = [...(currentAttachments || [])];
				updatedAttachments[index] = {
					number: index + 1,
					file,
					previewUrl: reader.result as string,
				};
				setValue('attachments', updatedAttachments);
			};
			reader.readAsDataURL(file);
		},
		[currentAttachments, setValue],
	);

	const addAttachmentField = () => {
		setValue('attachments', [
			...(currentAttachments || []),
			{ number: (currentAttachments?.length || 0) + 1 },
		]);
	};

	const removeAttachment = (index: number) => {
		const updatedAttachments = [...(currentAttachments || [])];
		updatedAttachments.splice(index, 1);
		setValue(
			'attachments',
			updatedAttachments.map((a, i) => ({ ...a, number: i + 1 })),
		);
	};

	const onSubmit = async (values: PostFormValues) => {
		setIsSubmitting(true);
		try {
			// Convert attachments to base64
			const attachmentsWithBase64 = await Promise.all(
				(values.attachments || []).map(async attachment => {
					if (!attachment.file) return null;

					const base64 = await new Promise<string>((resolve, reject) => {
						const reader = new FileReader();
						reader.readAsDataURL(attachment.file!);
						reader.onload = () => resolve(reader.result as string);
						reader.onerror = error => reject(error);
					});

					return {
						number: attachment.number,
						base64Attachment: base64,
					};
				}),
			).then(results => results.filter(Boolean));

			const payload = {
				...values,
				attachments: attachmentsWithBase64,
			};
			console.log(payload);

			const response = await api.post('/api/Posts', payload);
			toast.success('Post created successfully!');
			router.push(`/post/${response.data.id}`);
		} catch (error) {
			toast.error('Failed to create post');
			console.error('Error creating post:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='rounded-2xl bg-card p-5 shadow-sm'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
					<FormField
						control={form.control}
						name='title'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input placeholder='Enter post title' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='content'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Content</FormLabel>
								<FormControl>
									<Textarea
										placeholder='Write your post content here...'
										className='min-h-[200px]'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
						<FormField
							control={form.control}
							name='countryId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Country</FormLabel>
									<Select
										onValueChange={value => field.onChange(Number(value))}
										value={field.value?.toString()}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select a country' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{countries?.map(country => (
												<SelectItem
													key={country.id}
													value={country.id.toString()}
												>
													{country.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='cityId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>City</FormLabel>
									<Select
										onValueChange={value => field.onChange(Number(value))}
										value={field.value?.toString()}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select a city' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{cities?.map(city => (
												<SelectItem key={city.id} value={city.id.toString()}>
													{city.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name='budget'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Budget Level</FormLabel>
								<div className='flex items-center gap-4'>
									<input
										type='range'
										min='0'
										max='4'
										className='w-full'
										{...field}
										onChange={e => field.onChange(Number(e.target.value))}
									/>
									<BudgetIndicator level={field.value as 0 | 1 | 2 | 3 | 4} />
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='categoryIds'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Categories</FormLabel>
								<div className='flex flex-wrap gap-2'>
									{categories?.map(category => (
										<Badge
											key={category.id}
											variant={
												field.value?.includes(category.id)
													? 'default'
													: 'outline'
											}
											className='cursor-pointer'
											onClick={() => {
												const newValue = field.value?.includes(category.id)
													? field.value.filter(id => id !== category.id)
													: [...(field.value || []), category.id];
												field.onChange(newValue);
											}}
										>
											{category.name}
										</Badge>
									))}
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='tags'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tags</FormLabel>
								<FormControl>
									<Input
										placeholder='Add tags (comma separated)'
										onChange={e => {
											const tags = e.target.value
												.split(',')
												.map(tag => tag.trim())
												.filter(Boolean);
											field.onChange(tags);
										}}
									/>
								</FormControl>
								<div className='mt-2 flex flex-wrap gap-2'>
									{field.value?.map((tag, index) => (
										<Badge key={index} variant='secondary'>
											#{tag}
											<button
												type='button'
												onClick={() => {
													field.onChange(
														field.value?.filter((_, i) => i !== index),
													);
												}}
												className='ml-1'
											>
												<X className='h-3 w-3' />
											</button>
										</Badge>
									))}
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div>
						<FormLabel>Attachments</FormLabel>
						<div className='space-y-4'>
							{currentAttachments?.map((attachment, index) => (
								<div key={index} className='flex items-center gap-4'>
									<input
										type='file'
										id={`attachment-${index}`}
										className='hidden'
										onChange={e => handleFileChange(e, index)}
									/>
									<label
										htmlFor={`attachment-${index}`}
										className='flex-1 cursor-pointer rounded-md border p-4 hover:bg-accent'
									>
										{attachment.previewUrl ? (
											<div className='relative h-40 w-full'>
												<Image
													src={attachment.previewUrl}
													alt={`Preview ${attachment.number}`}
													fill
													className='object-contain'
													sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
												/>
											</div>
										) : (
											<div className='text-center text-muted-foreground'>
												<Plus className='mx-auto h-8 w-8' />
												<p>Click to upload attachment {attachment.number}</p>
											</div>
										)}
									</label>
									<Button
										type='button'
										variant='ghost'
										size='icon'
										onClick={() => removeAttachment(index)}
									>
										<Trash className='h-4 w-4 text-destructive' />
									</Button>
								</div>
							))}
							<Button
								type='button'
								variant='outline'
								onClick={addAttachmentField}
							>
								<Plus className='mr-2 h-4 w-4' />
								Add Attachment
							</Button>
						</div>
					</div>

					<Button type='submit' disabled={isSubmitting}>
						{isSubmitting ? 'Creating...' : 'Create Post'}
					</Button>
				</form>
			</Form>
		</div>
	);
}
