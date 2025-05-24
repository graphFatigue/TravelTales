import { useInfiniteQuery } from '@tanstack/react-query';
import { Blogger } from '@/types/types';
import api from '@/lib/api/api';

export interface BloggersResponse {
	items: Blogger[];
	currentPage: number;
	totalPages: number;
	pageSize: number;
	totalCount: number;
	hasPrevious: boolean;
	hasNext: boolean;
}

export const useInfiniteBloggers = (pageSize = 6) => {
	return useInfiniteQuery<BloggersResponse>({
		queryKey: ['bloggers', "all"],
		queryFn: async ({ pageParam = 1 }) => {
			const response = await api.get('/api/Blogger/filter', {
				params: {
					page: pageParam,
					pageSize,
				},
			});
			return response.data;
		},
		getNextPageParam: lastPage => {
			return lastPage.hasNext ? lastPage.currentPage + 1 : undefined;
		},
		initialPageParam: 1,
	});
};

