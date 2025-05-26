/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CalendarIcon } from 'lucide-react';

interface BirthDateFieldProps {
	control: any;
}

function formatDateForInput(date: string | Date): string {
	const d = new Date(date);
	return d.toISOString().split('T')[0];
}

export function BirthDateField({ control }: BirthDateFieldProps) {
	return (
		<FormField
			control={control}
			name='birthDate'
			render={({ field }) => (
				<FormItem>
					<FormLabel>Birth Date</FormLabel>
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
							<CalendarIcon className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transform' />
						</div>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
