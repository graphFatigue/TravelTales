import { useQuery } from '@tanstack/react-query';
import { Post } from '@/types/types';
import api from '@/lib/api/api';

export const usePost = (postId: number) => {
	return useQuery<Post, Error>({
		queryKey: ['post', postId],
		queryFn: async () => {
			const response = await api.get<Post>(`/api/Posts/${postId}`);
			return response.data;
		},
	});
};
