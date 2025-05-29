import { useInfiniteQuery } from '@tanstack/react-query';
import api from '@/lib/api/api';
import { Post } from '@/types/types';

interface PostsResponse {
	items: Post[];
	currentPage: number;
	totalPages: number;
	pageSize: number;
	totalCount: number;
	hasPrevious: boolean;
	hasNext: boolean;
}

export const useInfiniteBloggerPosts = ({
	bloggerId,
}: {
	bloggerId: number;
}) => {
	return useInfiniteQuery<PostsResponse>({
		queryKey: ['posts', bloggerId],
		queryFn: async ({ pageParam = 1 }) => {
			const response = await api.get(`/api/Posts/filter`, {
				params: {
					PageSize: 2,
					Page: pageParam,
					Filters: `bloggerId==${bloggerId}`,
					Sorts: '-createdAt',
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
