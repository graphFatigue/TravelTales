/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

interface GenderFieldProps {
	control: any;
}

export function GenderField({ control }: GenderFieldProps) {
	const { t } = useTranslation();
	return (
		<FormField
			control={control}
			name='sex'
			render={({ field }) => (
				<FormItem>
					<FormLabel>{t('profile.gender')}</FormLabel>
					<Select
						onValueChange={value => field.onChange(parseInt(value))}
						value={field.value.toString()}
					>
						<FormControl>
							<SelectTrigger>
								<SelectValue placeholder={t('profile.selectGender')} />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							<SelectItem value='0'>{t('profile.male')}</SelectItem>
							<SelectItem value='1'>{t('profile.female')}</SelectItem>
							<SelectItem value='2'>{t('profile.other')}</SelectItem>
						</SelectContent>
					</Select>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
