import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/api';
import { toast } from 'sonner';
import { Blogger } from '@/types/types';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';

export function useFollowMutations(bloggerId: number) {
	const queryClient = useQueryClient();
	const {t} = useTranslation();

	const { data: session } = useSession();

	const followMutation = useMutation({
		mutationFn: async () => {
			await api.post(`/api/BloggerFollow/${bloggerId}/follow`);
		},
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ['blogger', bloggerId] });

			const previousBlogger = queryClient.getQueryData<Blogger>([
				'blogger',
				bloggerId,
			]);

			if (previousBlogger) {
				queryClient.setQueryData(['blogger', bloggerId], {
					...previousBlogger,
					isFollowing: true,
					followerCount: previousBlogger.followerCount + 1,
				});
			}

			return { previousBlogger };
		},

		onError: (err, variables, context) => {
			if (context?.previousBlogger) {
				queryClient.setQueryData(
					['blogger', bloggerId],
					context.previousBlogger,
				);
			}
			toast.error(t('follow.followError'));
		},
		onSuccess: () => {
			toast.success(t('follow.followSuccess'));
			queryClient.invalidateQueries({ queryKey: ['blogger', bloggerId] });
			queryClient.invalidateQueries({
				queryKey: ['blogger', session?.user.blogger?.id],
			});
			queryClient.invalidateQueries({
				queryKey: ['posts', 'followers', session?.user.blogger?.id],
			});
		},
	});

	const unfollowMutation = useMutation({
		mutationFn: async () => {
			await api.delete(`/api/BloggerFollow/${bloggerId}/follow`);
		},
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ['blogger', bloggerId] });

			const previousBlogger = queryClient.getQueryData<Blogger>([
				'blogger',
				bloggerId,
			]);

			if (previousBlogger) {
				queryClient.setQueryData(['blogger', bloggerId], {
					...previousBlogger,
					isFollowing: false,
					followerCount: Math.max(0, previousBlogger.followerCount - 1),
				});
			}

			return { previousBlogger };
		},
		onError: (err, variables, context) => {
			if (context?.previousBlogger) {
				queryClient.setQueryData(
					['blogger', bloggerId],
					context.previousBlogger,
				);
			}
			toast.error(t('follow.unfollowError'));;
		},
		onSuccess: () => {
			toast.success(t('follow.unfollowSuccess'));
			queryClient.invalidateQueries({ queryKey: ['blogger', bloggerId] });
			queryClient.invalidateQueries({
				queryKey: ['blogger', session?.user.blogger?.id],
			});
			queryClient.invalidateQueries({
				queryKey: ['posts', 'followers', session?.user.blogger?.id],
			});
		},
	});

	return { followMutation, unfollowMutation };
}
