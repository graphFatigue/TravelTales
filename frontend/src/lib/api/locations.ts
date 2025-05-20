import api from "./api";

export interface Country {
	id: number;
	name: string;
	iso2: string;
	iso3: string;
}

export interface City {
	id: number;
	name: string;
	countryId: number;
}
export const fetchCountries = async (): Promise<Country[]> => {
	const { data } = await api.get<Country[]>('/api/Locations/countries');
	return data;
};

export const fetchCitiesByCountry = async (countryId: number | null): Promise<City[]> => {
	const { data } = await api.get<City[]>(`/api/Locations/countries/${countryId}/cities`);
	return data;
};
