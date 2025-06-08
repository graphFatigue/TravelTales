import {
	// City,
	Country,
	fetchCitiesByCountry,
	fetchCountries,
} from '@/lib/api/locations';
import { useQueries, useQuery } from '@tanstack/react-query';

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

	const cityQueries = useQueries({
		queries: normalizedCountryIds.map(countryId => ({
			queryKey: ['cities', countryId],
			queryFn: () => fetchCitiesByCountry(countryId),
			enabled: normalizedCountryIds.length > 0,
			staleTime: Infinity,
		})),
	});

	const cities = cityQueries.flatMap(query => query.data || []);
	const loadingCities = cityQueries.some(query => query.isLoading);
	const citiesError = cityQueries.find(query => query.error)?.error;

	return {
		countries,
		cities,
		loadingCountries,
		loadingCities,
		loading: loadingCountries || loadingCities,
		error: countriesError || citiesError,
	};
};
