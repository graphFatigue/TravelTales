// hooks/useFollowMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/api';
import { toast } from 'sonner';
import { Blogger } from '@/types/types';

export function useFollowMutations(bloggerId: number) {
	const queryClient = useQueryClient();

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
			toast.error('Failed to follow. Please try again.');
		},
		onSuccess: () => {
			toast.success('Followed successfully');
			queryClient.invalidateQueries({ queryKey: ['blogger', bloggerId] });
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
			toast.error('Failed to unfollow. Please try again.');
		},
		onSuccess: () => {
			toast.success('Unfollowed successfully');
			queryClient.invalidateQueries({ queryKey: ['blogger', bloggerId] });
		},
	});

	return { followMutation, unfollowMutation };
}
