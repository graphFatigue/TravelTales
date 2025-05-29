'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCategories } from '@/hooks/useCategories';
import { useLocationInfo } from '@/hooks/useLocationInfo';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { MultiSelect } from '../ui/multi-selesct';

export function PostsFilter() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const currentSearch = searchParams.get('s') || '';
	const currentCategories = searchParams.getAll('category');
	const currentBudgets = searchParams.getAll('budget');
	const currentCountries = searchParams.getAll('country');
	const currentCities = searchParams.getAll('city');

    const { data: categories } = useCategories();

	const [searchTerm, setSearchTerm] = useState(currentSearch);
	const [selectedCategories, setSelectedCategories] =
		useState<string[]>(currentCategories);
	const [selectedBudgets, setSelectedBudgets] =
		useState<string[]>(currentBudgets);
	const [selectedCountries, setSelectedCountries] =
		useState<string[]>(currentCountries);
	const [selectedCities, setSelectedCities] = useState<string[]>(currentCities);

    const countryIds = selectedCountries.map(id => Number(id));
		const { countries, cities } = useLocationInfo(countryIds);

	const budgetOptions = [
		{ value: '0', label: '$0 - $100' },
		{ value: '1', label: '$100 - $500' },
		{ value: '2', label: '$500 - $2000' },
		{ value: '3', label: '$2000 - $5000' },
		{ value: '4', label: '$5000+' },
	];

	const applyFilters = () => {
		const params = new URLSearchParams();

		if (searchTerm) params.set('s', searchTerm);
		else params.delete('s');

		params.delete('category');
		selectedCategories.forEach(cat => params.append('category', cat));

		params.delete('budget');
		selectedBudgets.forEach(budget => params.append('budget', budget));

		params.delete('country');
		selectedCountries.forEach(country => params.append('country', country));

		params.delete('city');
		selectedCities.forEach(city => params.append('city', city));

		router.push(`?${params.toString()}`, { scroll: false });
	};

	// const resetFilters = () => {
	// 	setSearchTerm('');
	// 	setSelectedCategories([]);
	// 	setSelectedBudgets([]);
	// 	setSelectedCountries([]);
	// 	setSelectedCities([]);
	// 	router.push('/', { scroll: false });
	// };

	return (
		<div className='space-y-4'>
			<div className='flex items-center gap-2'>
				<div className='relative flex-1'>
					<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground' />
					<Input
						placeholder='Search posts by title or tags...'
						className='pl-10'
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						onKeyDown={e => e.key === 'Enter' && applyFilters()}
					/>
				</div>
				<Button onClick={applyFilters}>Search</Button>
				{/* <Button variant='outline' onClick={resetFilters}>
					<X className='h-4 w-4' />
				</Button> */}
			</div>

			<div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<MultiSelect
					options={
						categories?.map(c => ({
							value: c.id.toString(),
							label: c.name,
						})) || []
					}
					defaultValue={selectedCategories}
					onValueChange={setSelectedCategories}
					placeholder='Select categories...'
				/>

				<MultiSelect
					options={budgetOptions}
					defaultValue={selectedBudgets}
					onValueChange={setSelectedBudgets}
					placeholder='Select budgets...'
				/>

				<MultiSelect
					options={
						countries?.map(c => ({
							value: c.id.toString(),
							label: c.name,
						})) || []
					}
					defaultValue={selectedCountries}
					onValueChange={values => {
						setSelectedCountries(values);
						setSelectedCities([]);
					}}
					placeholder='Select countries...'
				/>

				<MultiSelect
					options={
						cities?.map(c => ({
							value: c.id.toString(),
							label: c.name,
						})) || []
					}
					defaultValue={selectedCities}
					onValueChange={setSelectedCities}
					placeholder='Select cities...'
					disabled={selectedCountries.length === 0}
				/>
			</div>
		</div>
	);
}
