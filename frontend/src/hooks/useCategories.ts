import api from '@/lib/api/api';
import { Category } from '@/types/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

export const useCategory = (id: number) => {
	return useQuery<Category, Error>({
		queryKey: ['categories', id],
		queryFn: async () => {
			const response = await api.get<Category>(`/api/Categories/${id}`);
			return response.data;
		},
		staleTime: Infinity,
	});
};

export const useCreateCategory = () => {
	const queryClient = useQueryClient();

	return useMutation<
		Category,
		Error,
		Omit<Category, 'id' | 'createdAt' | 'modifiedAt' | 'isDeleted'>
	>({
		mutationFn: async newCategory => {
			const response = await api.post<Category>('/api/Categories', newCategory);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories'] });
		},
	});
};

export const useUpdateCategory = () => {
	const queryClient = useQueryClient();

	return useMutation<
		void,
		Error,
		{
			id: number;
			data: Omit<Category, 'id' | 'createdAt' | 'modifiedAt' | 'isDeleted'>;
		}
	>({
		mutationFn: async ({ id, data }) => {
			await api.put(`/api/Categories/${id}`, data);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['categories'] });
			queryClient.invalidateQueries({ queryKey: ['categories', variables.id] });
		},
	});
};

export const useDeleteCategory = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number>({
		mutationFn: async id => {
			await api.delete(`/api/Categories/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories'] });
		},
	});
};
