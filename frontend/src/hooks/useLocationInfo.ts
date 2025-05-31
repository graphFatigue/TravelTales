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

	// const {
	// 	data: cities,
	// 	isLoading: loadingCities,
	// 	error: citiesError,
	// } = useQuery<City[]>({
	// 	queryKey: ['cities', ...normalizedCountryIds],
	// 	queryFn: async () => {
	// 		// if (normalizedCountryIds.length === 0) return Promise.resolve([]);
	// 		// return Promise.all(
	// 		// 	normalizedCountryIds.map(id => fetchCitiesByCountry(id)),
	// 		// ).then(results => results.flat());
	// 		if (normalizedCountryIds.length === 0) return [];
	// 		const results = [];
	// 		for (const countryId of normalizedCountryIds) {
	// 			const cities = await fetchCitiesByCountry(countryId);
	// 			results.push(...cities);
	// 			await delay(500); // 500ms delay between requests
	// 		}
	// 		return results;
	// 	},
	// 	enabled: normalizedCountryIds.length > 0,
	// 	staleTime: Infinity,
	// });

	const cityQueries = useQueries({
		queries: normalizedCountryIds.map(countryId => ({
			queryKey: ['cities', countryId],
			queryFn: () => fetchCitiesByCountry(countryId),
			enabled: normalizedCountryIds.length > 0,
			staleTime: Infinity,
		})),
	});

	// Combine results
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
