import getTravelerRating from '@/lib/getTravelRating';
import { useEffect, useState } from 'react';

export const useTravelerRating = (visitedCities: number) => {
	const initialTravelerRating = getTravelerRating(visitedCities || 0);

	const [travelerRating, setTravelerRating] = useState(initialTravelerRating);

	useEffect(() => {
		setTravelerRating(getTravelerRating(visitedCities || 0));
    }, [visitedCities]);
    
	return travelerRating;
};
