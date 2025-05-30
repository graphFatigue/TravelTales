import {
	City,
	Country,
	fetchCitiesByCountry,
	fetchCountries,
} from '@/lib/api/locations';
import { useQuery } from '@tanstack/react-query';

export const useLocationInfo = (
	countryIds: number[] | number | undefined | null,
) => {
	const normalizedCountryIds = Array.isArray(countryIds)
		? countryIds
		: countryIds !== undefined && countryIds !== null
			? [countryIds]
			: [];

	const {
		data: countries,
		isLoading: loadingCountries,
		error: countriesError,
	} = useQuery<Country[]>({
		queryKey: ['countries'],
		queryFn: fetchCountries,
		staleTime: Infinity,
	});

	const {
		data: cities,
		isLoading: loadingCities,
		error: citiesError,
	} = useQuery<City[]>({
		queryKey: ['cities', ...normalizedCountryIds],
		queryFn: () => {
			if (normalizedCountryIds.length === 0) return Promise.resolve([]);
			return Promise.all(
				normalizedCountryIds.map(id => fetchCitiesByCountry(id)),
			).then(results => results.flat());
		},
		enabled: normalizedCountryIds.length > 0,
		staleTime: Infinity,
	});

	return {
		countries,
		cities,
		loadingCountries,
		loadingCities,
		loading: loadingCountries || loadingCities,
		error: countriesError || citiesError,
	};
};
