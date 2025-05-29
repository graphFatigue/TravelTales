/* eslint-disable @typescript-eslint/no-explicit-any */
import { useInfiniteQuery } from '@tanstack/react-query';
import api from '@/lib/api/api';
import { useSearchParams } from 'next/navigation';
import { Post } from '@/types/types';

export interface PostsResponse {
	items: Post[];
	currentPage: number;
	totalPages: number;
	pageSize: number;
	totalCount: number;
	hasPrevious: boolean;
	hasNext: boolean;
}

export const useInfinitePosts = (pageSize = 3) => {
	const searchParams = useSearchParams();

	const searchTerm = searchParams.get('search') || '';
	const categories = searchParams.getAll('category');
	const budgets = searchParams.getAll('budget');
	const countries = searchParams.getAll('country');
	const cities = searchParams.getAll('city');

	return useInfiniteQuery<PostsResponse>({
		queryKey: [
			'posts',
			searchTerm,
			...categories,
			...budgets,
			...countries,
			...cities,
		],
		queryFn: async ({ pageParam = 1 }) => {
			const params: Record<string, any> = {
				page: pageParam,
				pageSize,
			};

			const filters = [];

			if (searchTerm) {
				filters.push(`title@=*${searchTerm}`);
				// need to add tags
				// filters.push(`(title@=*${searchTerm}|tags@=*${searchTerm})`);
			}

			if (categories.length > 0) {
				// i don't know how to do this
				filters.push(`categoryId==${categories.join('|')}`);
			}

			if (budgets.length > 0) {
				filters.push(`budget==${budgets.join('|')}`);
			}

			if (countries.length > 0) {
				filters.push(`countryId==${countries.join('|')}`);
			}

			if (cities.length > 0) {
				filters.push(`cityId==${cities.join('|')}`);
			}

			if (filters.length > 0) {
				params.filters = filters.join(',');
            }
            
            console.log(filters);

			const response = await api.get('/api/Posts/filter', { params });
			return response.data;
		},
		getNextPageParam: lastPage => {
			return lastPage.hasNext ? lastPage.currentPage + 1 : undefined;
		},
		initialPageParam: 1,
	});
};
