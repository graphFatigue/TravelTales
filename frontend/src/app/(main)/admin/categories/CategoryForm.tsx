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
import { CategoryFormValues, getCategoryFormSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';


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
	const { t } = useTranslation();
	const form = useForm<CategoryFormValues>({
		resolver: zodResolver(getCategoryFormSchema(t)),
		defaultValues: defaultValues || {
			name: '',
			description: '',
			nameUa: '',
			descriptionUa: '',
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
							<FormLabel>{t('categories.name')}</FormLabel>
							<FormControl>
								<Input
									placeholder={t('categories.namePlaceholder')}
									{...field}
								/>
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
							<FormLabel>{t('categories.description')}</FormLabel>
							<FormControl>
								<Textarea
									placeholder={t('categories.descriptionPlaceholder')}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='nameUa'
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('categories.name')}</FormLabel>
							<FormControl>
								<Input
									placeholder={t('categories.namePlaceholder')}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='descriptionUa'
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('categories.description')}</FormLabel>
							<FormControl>
								<Textarea
									placeholder={t('categories.descriptionPlaceholder')}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit' disabled={isSubmitting}>
					{isSubmitting ? t('categories.saving') : t('categories.save')}
				</Button>
			</form>
		</Form>
	);
}
