import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/api';
import { toast } from 'sonner';

export const useDeletePost = (postId: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			await api.delete(`/api/Posts/${postId}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['posts'] });
			queryClient.removeQueries({ queryKey: ['post', postId] });

			toast.success('Post has been deleted successfully.');
		},
		onError: (error) => {
			console.error(error);
			toast.error('Failed to delete post.');
		},
	});
};
