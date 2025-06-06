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

interface BasicInfoSectionProps {
	control: any;
}

export function BasicInfoSection({ control }: BasicInfoSectionProps) {
	const { t } = useTranslation();
	return (
		<div className='grid grid-cols-2 gap-4'>
			<FormField
				control={control}
				name='firstName'
				render={({ field }) => (
					<FormItem>
						<FormLabel>{t('auth.firstName')}</FormLabel>
						<FormControl>
							<Input
								placeholder={t('auth.firstName')}
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={control}
				name='lastName'
				render={({ field }) => (
					<FormItem>
						<FormLabel>{t('auth.lastName')}</FormLabel>
						<FormControl>
							<Input
								placeholder={t('auth.lastName')}
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
