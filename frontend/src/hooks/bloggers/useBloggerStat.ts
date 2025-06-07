import { useQuery } from '@tanstack/react-query';
import { BloggerStats } from '@/types/types';
import api from '@/lib/api/api';

export const useBloggerStats = (bloggerId?: number) => {
	return useQuery<BloggerStats, Error>({
		queryKey: ['blogger', 'statistics', bloggerId],
		queryFn: async () => {
			const response = await api.get<BloggerStats>(
				`/api/Blogger/${bloggerId}/stats`,
			);
			return response.data;
		},
		staleTime: 1000 * 60,
	});
};
