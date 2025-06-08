/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { City, Country } from '@/types/types';

interface LocationFieldsProps {
	control: any;
	countries: Country[];
	cities: City[];
	loadingCities: boolean;
	loadingCountries: boolean;
	countryId?: number;
	selectedCountry?: Country;
	selectedCity?: City;
	t: (key: string) => string;
}

export function LocationFields({
	control,
	countries,
	cities,
	loadingCities,
	loadingCountries,
	countryId,
	selectedCountry,
	selectedCity,
	t,
}: LocationFieldsProps) {
	return (
		<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
			<FormField
				control={control}
				name='countryId'
				render={({ field }) => (
					<FormItem>
						<FormLabel>{t('post.country')}</FormLabel>
						<Select
							onValueChange={value => {
								field.onChange(Number(value));
							}}
							value={field.value?.toString()}
							disabled={loadingCountries}
						>
							<FormControl>
								<SelectTrigger>
									<SelectValue
										placeholder={
											selectedCountry?.name || t('post.selectCountry')
										}
									>
									</SelectValue>
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								{countries?.map(country => (
									<SelectItem
										key={country.id}
										value={country.id.toString()}
										onClick={e => e.preventDefault()}
									>
										{country.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name='cityId'
				render={({ field }) => (
					<FormItem>
						<FormLabel>{t('post.city')}</FormLabel>
						<Select
							onValueChange={value => field.onChange(Number(value))}
							value={field.value?.toString()}
							disabled={!countryId || loadingCities}
						>
							<FormControl>
								<SelectTrigger>
									<SelectValue
										placeholder={selectedCity?.name || t('post.selectCity')}
									>
										{selectedCity?.name}
									</SelectValue>
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								{cities?.map(city => (
									<SelectItem key={city.id} value={city.id.toString()}>
										{city.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
