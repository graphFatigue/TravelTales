/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

interface BirthDateFieldProps {
	control: any;
}

function formatDateForInput(date: string | Date): string {
	const d = new Date(date);
	return d.toISOString().split('T')[0];
}

export function BirthDateField({ control }: BirthDateFieldProps) {
	const { t } = useTranslation();
	return (
		<FormField
			control={control}
			name='birthDate'
			render={({ field }) => (
				<FormItem>
					<FormLabel>{t('auth.birthDate')}</FormLabel>
					<FormControl>
						<div className='relative'>
							<Input
								type='date'
								className='pr-10'
								{...field}
								value={field.value ? formatDateForInput(field.value) : ''}
								onChange={e => {
									const date = e.target.value;
									field.onChange(date ? new Date(date).toISOString() : null);
								}}
							/>
						</div>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
