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
import { UpdateBloggerProfileValues } from '@/lib/validation';
import { City, Country } from '@/types/types';
import { UseFormSetValue } from 'react-hook-form';

interface LocationSectionProps {
	control: any;
	selectedCountryId: number | undefined;
	loading: boolean;
	countries: Country[] | undefined;
	cities: City[] | undefined;
	setValue: UseFormSetValue<UpdateBloggerProfileValues>;
}

export function LocationSection({
	control,
	selectedCountryId,
	loading,
	countries,
	cities,
	setValue,
}: LocationSectionProps) {
	return (
		<div className='grid grid-cols-2 gap-4'>
			<FormField
				control={control}
				name='countryId'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Country</FormLabel>
						<Select
							onValueChange={value => {
								field.onChange(parseInt(value));
								setValue('cityId', undefined);
							}}
							value={field.value?.toString()}
							disabled={loading}
						>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder='Select country' />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								{countries?.map(country => (
									<SelectItem key={country.id} value={country.id.toString()}>
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
						<FormLabel>City</FormLabel>
						<Select
							onValueChange={value => field.onChange(parseInt(value))}
							value={field.value?.toString()}
							disabled={!selectedCountryId || loading}
						>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder='Select city' />
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
