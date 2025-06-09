export default function getTravelerRating(citiesCount: number) {
	if (citiesCount >= 51)
		return {
			id: 5,
		};
	if (citiesCount >= 31)
		return {
			id: 4,
		};
	if (citiesCount >= 16)
		return {
			id: 3,
		};
	if (citiesCount >= 6)
		return {
			id: 2,
		};
	return {
		id: 1,
	};
}
