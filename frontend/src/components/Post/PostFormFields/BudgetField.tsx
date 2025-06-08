/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { BudgetIndicator } from '../BudgetIndicator';

interface BudgetFieldProps {
	control: any;
	t: (key: string) => string;
}

export function BudgetField({ control, t }: BudgetFieldProps) {
	return (
		<FormField
			control={control}
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
	);
}
