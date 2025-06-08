/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Category } from '@/types/types';
import { CategoryBadge } from '../CategoryBadge';

interface CategoriesFieldProps {
	control: any;
	categories: Category[];
	currentLanguage: string;
	t: (key: string) => string;
}

export function CategoriesField({
	control,
	categories,
	currentLanguage,
	t,
}: CategoriesFieldProps) {
	return (
		<FormField
			control={control}
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
										? field.value.filter((id: number) => id !== category.id)
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
	);
}
