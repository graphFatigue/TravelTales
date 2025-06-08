'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { useCategories } from '@/hooks/useCategories';
import { useLocationInfo } from '@/hooks/useLocationInfo';
import { getPostFormSchema, PostFormValues } from '@/lib/validation';
import api from '@/lib/api/api';
import { Post } from '@/types/types';
import { getFileType } from '@/lib/utils';
import { LocationFields } from './PostFormFields/LocationFields';
import { BudgetField } from './PostFormFields/BudgetField';
import { CategoriesField } from './PostFormFields/CategoriesField';
import { TagsField } from './PostFormFields/TagsField';
import { AttachmentsField } from './PostFormFields/AttachmentsField';

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

					<LocationFields
						control={form.control}
						countries={countries || []}
						cities={cities || []}
						loadingCities={loadingCities}
						loadingCountries={loadingCountries}
						countryId={countryId}
						selectedCountry={selectedCountry}
						selectedCity={selectedCity}
						t={t}
					/>

					<BudgetField control={form.control} t={t} />

					<CategoriesField
						control={form.control}
						categories={categories || []}
						currentLanguage={currentLanguage}
						t={t}
					/>

					<TagsField control={form.control} t={t} />

					<AttachmentsField
						attachments={currentAttachments || []}
						handleFileChange={handleFileChange}
						removeAttachment={removeAttachment}
						addAttachmentField={addAttachmentField}
						errors={form.formState.errors.attachments}
						t={t}
					/>

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
