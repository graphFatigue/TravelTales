/* eslint-disable @typescript-eslint/no-explicit-any */
import { useInfiniteQuery } from '@tanstack/react-query';
import { Blogger, FollowBlogger } from '@/types/types';
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

export const useInfiniteBloggers = (pageSize = 6, searchTerm?: string) => {
	return useInfiniteQuery<BloggersResponse>({
		queryKey: ['bloggers', searchTerm || 'all'],
		queryFn: async ({ pageParam = 1 }) => {
			const params: Record<string, any> = {
				page: pageParam,
				pageSize,
			};

			if (searchTerm) {
				params.filters = `(firstName|lastName|cityName|countryName)@=*${searchTerm}`;
			}

			const response = await api.get('/api/Blogger/filter', { params });
			return response.data;
		},
		getNextPageParam: lastPage => {
			return lastPage.hasNext ? lastPage.currentPage + 1 : undefined;
		},
		initialPageParam: 1,
	});
};

export interface FollowBloggersResponse {
	items: FollowBlogger[];
	currentPage: number;
	totalPages: number;
	pageSize: number;
	totalCount: number;
	hasPrevious: boolean;
	hasNext: boolean;
}

export const useInfiniteFollowersBloggers = (bloggerId: number) => {
	return useInfiniteQuery<FollowBloggersResponse>({
		queryKey: ['bloggers', 'followers', bloggerId],
		queryFn: async ({ pageParam = 1 }) => {
			const response = await api.get(
				`/api/BloggerFollow/${bloggerId}/followers`,
				{
					params: {
						page: pageParam,
						pageSize: 4,
					},
				},
			);
			return response.data;
		},
		getNextPageParam: lastPage => {
			return lastPage.hasNext ? lastPage.currentPage + 1 : undefined;
		},
		initialPageParam: 1,
	});
};

export const useInfiniteFollowingBloggers = (bloggerId: number) => {
	return useInfiniteQuery<FollowBloggersResponse>({
		queryKey: ['bloggers', 'following', bloggerId],
		queryFn: async ({ pageParam = 1 }) => {
			const response = await api.get(
				`/api/BloggerFollow/${bloggerId}/following`,
				{
					params: {
						page: pageParam,
						pageSize: 4,
					},
				},
			);
			return response.data;
		},
		getNextPageParam: lastPage => {
			return lastPage.hasNext ? lastPage.currentPage + 1 : undefined;
		},
		initialPageParam: 1,
	});
};
