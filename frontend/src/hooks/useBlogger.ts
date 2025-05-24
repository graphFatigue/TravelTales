import { useQuery } from '@tanstack/react-query';
import { Blogger } from '@/types/types';
import api from '@/lib/api/api';

interface UseBloggerOptions {
	initialData?: Blogger;
}

export const useBlogger = (bloggerId?: number, options?: UseBloggerOptions) => {
	return useQuery<Blogger, Error>({
		queryKey: ['blogger', bloggerId],
		queryFn: async () => {
			const response = await api.get<Blogger>(`/api/Blogger/${bloggerId}`);
			return response.data;
		},
		initialData: options?.initialData,
		staleTime: 1000 * 60 * 5,
	});
};
