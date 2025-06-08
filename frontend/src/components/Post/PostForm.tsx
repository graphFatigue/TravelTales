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
import { getPostFormSchema, PostFormValues } from '@/lib/validation';
import api from '@/lib/api/api';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Post } from '@/types/types';
import { getFileType } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { CategoryBadge } from './CategoryBadge';

interface PostFormProps {
	post?: Post;
	isEditing?: boolean;
}

export function PostForm({ post, isEditing = false }: PostFormProps) {
	const { data: session } = useSession();
	const bloggerId = session?.user.blogger?.id;
	const router = useRouter();
	const { data: categories } = useCategories();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { t, i18n } = useTranslation();
	const currentLanguage = i18n.language;

	const form = useForm<PostFormValues>({
		resolver: zodResolver(getPostFormSchema(t)),
		defaultValues: {
			title: post?.title || '',
			content: post?.content || '',
			bloggerId: post?.bloggerId || bloggerId,
			budget: post?.budget || 0,
			categoryIds: post?.categories?.map(c => c.id) || [],
			tags: post?.tags || [],
			attachments:
				post?.attachments?.map(attachment => ({
					id: attachment.id,
					number: attachment.number,
					previewUrl: attachment.uri,
					type: getFileType(attachment.uri),
				})) || [],
			cityId: post?.cityId || undefined,
			countryId: post?.countryId || undefined,
		},
	});

	const countryId = form.watch('countryId');
	const { countries, cities, loadingCities, loadingCountries } =
		useLocationInfo(countryId);

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
					...updatedAttachments[index],
					number: index + 1,
					file,
					previewUrl: reader.result as string,
					type: file.type.startsWith('video/') ? 'video' : 'image',
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
			{ shouldValidate: true },
		);
	};

	const onSubmit = async (values: PostFormValues) => {
		setIsSubmitting(true);
		try {
			const attachmentsWithBase64 = await Promise.all(
				(values.attachments || [])
					.filter(attachment => attachment.file)
					.map(async attachment => {
						const base64 = await new Promise<string>((resolve, reject) => {
							const reader = new FileReader();
							reader.readAsDataURL(attachment.file!);
							reader.onload = () => {
								const result = reader.result as string;
								resolve(result);
							};
							reader.onerror = error => reject(error);
						});

						return {
							number: attachment.number,
							base64Attachment: base64,
						};
					}),
			);

			const commonPayload = {
				title: values.title,
				content: values.content,
				cityId: values.cityId,
				countryId: values.countryId,
				budget: values.budget,
				categoryIds: values.categoryIds,
				tags: values.tags,
			};

			if (isEditing && post) {
				const existingAttachmentIds = post.attachments?.map(a => a.id) || [];
				const currentAttachmentIds = (values.attachments || [])
					.filter(a => a.id)
					.map(a => a.id) as number[];
				const attachmentsToDelete = existingAttachmentIds.filter(
					id => !currentAttachmentIds.includes(id),
				);

				const response = await api.put(`/api/Posts/${post.id}`, {
					...commonPayload,
					newAttachments: attachmentsWithBase64,
					attachmentsToDelete,
				});
				router.push(`/post/${response.data.id}`);
				toast.success(t('post.updateSuccess'));
			} else {
				console.log({
					...commonPayload,
					bloggerId: values.bloggerId,
					attachments: attachmentsWithBase64,
				});
				const response = await api.post('/api/Posts', {
					...commonPayload,
					bloggerId: values.bloggerId,
					attachments: attachmentsWithBase64,
				});
				toast.success(t('post.createSuccess'));
				router.push(`/post/${response.data.id}`);
				return;
			}

			router.refresh();
		} catch (error) {
			toast.error(isEditing ? t('post.updateError') : t('post.createError'));
			console.error('Error:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const selectedCountry = countries?.find(c => c.id === post?.countryId);
	const selectedCity = cities?.find(c => c.id === post?.cityId);

	return (
		<div className='rounded-2xl bg-card p-5 shadow-sm'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
					<FormField
						control={form.control}
						name='title'
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t('post.title')}</FormLabel>
								<FormControl>
									<Input placeholder={t('post.enterTitle')} {...field} />
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
								<FormLabel>{t('post.content')}</FormLabel>
								<FormControl>
									<Textarea
										placeholder={t('post.writeContent')}
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
									<FormLabel>{t('post.country')}</FormLabel>
									<Select
										onValueChange={value => {
											field.onChange(Number(value));
											form.setValue('cityId', undefined);
										}}
										value={field.value?.toString()}
										disabled={loadingCountries}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													placeholder={
														selectedCountry?.name || t('post.selectCountry')
													}
												>
													{selectedCountry?.name}
												</SelectValue>
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
									<FormLabel>{t('post.city')}</FormLabel>
									<Select
										onValueChange={value => field.onChange(Number(value))}
										value={field.value?.toString()}
										disabled={!countryId || loadingCities}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													placeholder={
														selectedCity?.name || t('post.selectCity')
													}
												>
													{selectedCity?.name}
												</SelectValue>
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
								<FormLabel>{t('post.budget')}</FormLabel>
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
								<FormLabel>{t('dashboard.categories')}</FormLabel>
								<div className='flex flex-wrap gap-2'>
									{categories?.map(category => (
										<CategoryBadge
											key={category.id}
											category={category}
											language={currentLanguage}
											onClick={() => {
												const newValue = field.value?.includes(category.id)
													? field.value.filter(id => id !== category.id)
													: [...(field.value || []), category.id];
												field.onChange(newValue);
											}}
											selected={field.value?.includes(category.id)}
											className='cursor-pointer'
										/>
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
								<FormLabel>{t('post.tags')}</FormLabel>
								<FormControl>
									<Input
										placeholder={t('post.addTags')}
										onKeyDown={e => {
											if (['Enter', ' '].includes(e.key)) {
												e.preventDefault();
												const value = e.currentTarget.value.trim();
												if (value) {
													field.onChange([...(field.value || []), value]);
													e.currentTarget.value = '';
												}
											}
										}}
										onBlur={e => {
											const value = e.target.value.trim();
											if (value) {
												field.onChange([...(field.value || []), value]);
												e.target.value = '';
											}
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
						<FormLabel>{t('post.attachments')}</FormLabel>
						<div className='space-y-4'>
							{currentAttachments?.map((attachment, index) => (
								<div key={index || attachment.id}>
									<div className='flex items-center gap-4'>
										<input
											type='file'
											id={`attachment-${index}`}
											className='hidden'
											onChange={e => handleFileChange(e, index)}
											accept='image/jpeg, image/png, video/mp4, video/mov'
										/>
										<label
											htmlFor={`attachment-${index}`}
											className='flex-1 cursor-pointer rounded-md border p-4 hover:bg-accent'
										>
											{attachment.previewUrl ? (
												<div className='relative h-40 w-full'>
													{attachment.type === 'video' ? (
														<video
															controls
															className='h-full w-full object-contain'
														>
															<source
																src={attachment.previewUrl}
																type={attachment.file?.type}
															/>
														</video>
													) : (
														<Image
															src={attachment.previewUrl}
															alt={`Preview ${attachment.number}`}
															fill
															className='object-contain'
															sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
														/>
													)}
												</div>
											) : (
												<div className='text-center text-muted-foreground'>
													<Plus className='mx-auto h-8 w-8' />
													<p>
														{t('post.addAttachments')} {attachment.number}
													</p>
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
									{form.formState.errors.attachments?.[index]?.file && (
										<p className='text-sm text-destructive'>
											{form.formState.errors.attachments[index]?.file?.message}
										</p>
									)}
								</div>
							))}
							<Button
								type='button'
								variant='outline'
								onClick={addAttachmentField}
							>
								<Plus className='mr-2 h-4 w-4' />
								{t('post.addAttachmentsButton')}
							</Button>
						</div>
					</div>

					<Button type='submit' disabled={isSubmitting}>
						{isSubmitting
							? isEditing
								? t('post.saving')
								: t('post.creating')
							: isEditing
								? t('post.save')
								: t('post.createPostButton')}
					</Button>
				</form>
			</Form>
		</div>
	);
}
