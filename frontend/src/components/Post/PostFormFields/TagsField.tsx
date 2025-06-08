/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from '@/components/ui/badge';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface TagsFieldProps {
	control: any;
	t: (key: string) => string;
}

export function TagsField({ control, t }: TagsFieldProps) {
	return (
		<FormField
			control={control}
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
						{field.value?.map((tag: string, index: number) => (
							<Badge key={index} variant='secondary'>
								#{tag}
								<button
									type='button'
									onClick={() => {
										field.onChange(
											field.value?.filter((_: never, i: number) => i !== index),
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
	);
}
