import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/api';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const useDeletePost = (postId: number) => {
	const queryClient = useQueryClient();
	const { t } = useTranslation();

	return useMutation({
		mutationFn: async () => {
			await api.delete(`/api/Posts/${postId}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['posts'] });
			queryClient.removeQueries({ queryKey: ['post', postId] });

			toast.success(t('post.deleteSuccess'));
		},
		onError: error => {
			console.error(error);
			toast.error(t('post.deleteError'));
		},
	});
};
