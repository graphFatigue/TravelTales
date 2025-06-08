import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/api';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Post } from '@/types/types';

export const useDeletePost = (post: Post) => {
	const queryClient = useQueryClient();
	const { t } = useTranslation();

	return useMutation({
		mutationFn: async () => {
			await api.delete(`/api/Posts/${post.id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['posts'] });
			queryClient.invalidateQueries({ queryKey: ['blogger', post.bloggerId] });
			queryClient.removeQueries({ queryKey: ['post', post.id] });

			toast.success(t('post.deleteSuccess'));
		},
		onError: error => {
			console.error(error);
			toast.error(t('post.deleteError'));
		},
	});
};
