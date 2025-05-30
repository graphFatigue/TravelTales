'use client';
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
import { useLocationInfo } from '@/hooks/useLocationInfo';
import { UpdateBloggerProfileValues } from '@/lib/validation';
import { City, Country } from '@/types/types';
import { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { MultiSelect } from '../ui/multi-selesct';

interface LocationSectionProps {
	control: any;
	selectedCountryId: number | undefined;
	loading: boolean;
	countries: Country[] | undefined;
	cities: City[] | undefined;
	setValue: UseFormSetValue<UpdateBloggerProfileValues>;
	visitedCountries: Country[];
	visitedCities: City[];
}

export function LocationSection({
	control,
	selectedCountryId,
	loading,
	countries,
	cities,
	setValue,
	visitedCountries,
	visitedCities,
}: LocationSectionProps) {
	const [selectedVisitedCountries, setSelectedVisitedCountries] = useState<
		string[]
	>(visitedCountries.map(c => c.id.toString()));

	const { cities: allVisitedCities } = useLocationInfo(
		selectedVisitedCountries.map(id => Number(id)),
	);

	return (
		<div className='space-y-4'>
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
										<SelectItem
											key={city.id}
											value={city.id.toString()}
											onClick={e => e.preventDefault()}
										>
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

			{/* Visited Countries and Cities */}
			<div className='space-y-2'>
				<FormField
					control={control}
					name='visitedCountryIds'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Visited Countries</FormLabel>
							<MultiSelect
								options={
									countries?.map(c => ({
										value: c.id.toString(),
										label: c.name,
									})) || []
								}
								defaultValue={visitedCountries.map(c => c.id.toString())}
								onValueChange={values => {
									field.onChange(values.map(v => parseInt(v)));
									setSelectedVisitedCountries(values);
									setValue('visitedCityIds', []);
								}}
								modalPopover={true}
								placeholder='Select visited countries...'
							/>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name='visitedCityIds'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Visited Cities</FormLabel>
							<MultiSelect
								options={
									allVisitedCities?.map(c => ({
										value: c.id.toString(),
										label: c.name,
									})) || []
								}
								defaultValue={visitedCities.map(c => c.id.toString())}
								onValueChange={values => {
									field.onChange(values.map(v => parseInt(v)));
								}}
								placeholder='Select visited cities...'
								disabled={selectedVisitedCountries.length === 0}
								modalPopover={true}
							/>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
}
