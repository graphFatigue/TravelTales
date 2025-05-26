/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface BioFieldProps {
	control: any;
}

export function BioField({ control }: BioFieldProps) {
	return (
		<FormField
			control={control}
			name='bio'
			render={({ field }) => (
				<FormItem>
					<FormLabel>Bio</FormLabel>
					<FormControl>
						<Textarea
							placeholder='Tell us about yourself...'
							className='resize-none'
							{...field}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
