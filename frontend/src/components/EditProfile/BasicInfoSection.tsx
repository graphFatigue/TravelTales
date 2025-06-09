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
		<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
			<FormField
				control={control}
				name='firstName'
				render={({ field }) => (
					<FormItem>
						<FormLabel className='text-sm sm:text-base'>{t('auth.firstName')}</FormLabel>
						<FormControl>
							<Input
								placeholder={t('auth.firstName')}
								className='h-9 text-sm sm:h-10 sm:text-base'
								{...field}
							/>
						</FormControl>
						<FormMessage className='text-xs sm:text-sm' />
					</FormItem>
				)}
			/>
			<FormField
				control={control}
				name='lastName'
				render={({ field }) => (
					<FormItem>
						<FormLabel className='text-sm sm:text-base'>{t('auth.lastName')}</FormLabel>
						<FormControl>
							<Input
								placeholder={t('auth.lastName')}
								className='h-9 text-sm sm:h-10 sm:text-base'
								{...field}
							/>
						</FormControl>
						<FormMessage className='text-xs sm:text-sm' />
					</FormItem>
				)}
			/>
		</div>
	);
}
