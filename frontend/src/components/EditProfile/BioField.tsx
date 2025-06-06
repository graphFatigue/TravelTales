/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';

interface BioFieldProps {
	control: any;
}

export function BioField({ control }: BioFieldProps) {
	const { t } = useTranslation();
	return (
		<FormField
			control={control}
			name='bio'
			render={({ field }) => (
				<FormItem>
					<FormLabel>{t('profile.bio')}</FormLabel>
					<FormControl>
						<Textarea
							placeholder={t('profile.bioPlaceholder')}
							className='min-h-[100px]'
							{...field}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
