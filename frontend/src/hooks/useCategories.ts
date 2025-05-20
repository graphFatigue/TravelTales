import api from '@/lib/api/api';
import { Category } from '@/types/types';
import { useQuery } from '@tanstack/react-query';

export const useCategories = () => {
	return useQuery<Category[], Error>({
		queryKey: ['categories'],
		queryFn: async () => {
			const response = await api.get<Category[]>('/api/Categories');
			return response.data;
		},
		staleTime: Infinity,
	});
};
