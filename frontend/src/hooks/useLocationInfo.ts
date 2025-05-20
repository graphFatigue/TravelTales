// hooks/useLocationInfo.ts
import { City, Country, fetchCitiesByCountry, fetchCountries } from '@/lib/api/locations';
import { useQuery } from '@tanstack/react-query';


export const useLocationInfo = (countryId: number | null) => {
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
		queryKey: ['cities', countryId],
		queryFn: () => fetchCitiesByCountry(countryId!),
		enabled: !!countryId,
		staleTime: Infinity,
	});

	return {
		countries,
		cities,
		loading: loadingCountries || loadingCities,
		error: countriesError || citiesError,
	};
};
