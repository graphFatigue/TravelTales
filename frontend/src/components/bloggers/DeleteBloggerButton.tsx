/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signOut, useSession } from 'next-auth/react';
import api from '@/lib/api/api';
import { toast } from 'sonner';
import ConfirmationDialog from '../ConfirmationDialog';
import { redirect } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface DeleteBloggerButtonProps {
	bloggerId: number;
}

export function DeleteBloggerButton({ bloggerId }: DeleteBloggerButtonProps) {
	const queryClient = useQueryClient();
	const { data: session } = useSession();
	const { t } = useTranslation();

	const deleteBloggerMutation = useMutation({
		mutationFn: async () => {
			await api.delete(`/api/Blogger/${bloggerId}`);
		},
		onSuccess: async () => {
			await queryClient.removeQueries({ queryKey: ['blogger', bloggerId] });
			toast.success(t('profile.deleteProfile.successedDelete'));
			queryClient.invalidateQueries({ queryKey: ['bloggers'] });
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
		onError: (error: any) => {
			console.error('Failed to delete blogger:', error);
			toast.error(t('profile.deleteProfile.failedDelete'));
		},
	});

	const handleDelete = async () => {
		deleteBloggerMutation.mutate();
		queryClient.removeQueries({
			queryKey: ['blogger', bloggerId],
		});
		if (session?.user?.blogger?.id === bloggerId) {
			await signOut({ callbackUrl: '/' });
			queryClient.removeQueries({
				queryKey: ['notifications', bloggerId],
			});
			queryClient.invalidateQueries({ queryKey: ['bloggers'] });
			queryClient.invalidateQueries({ queryKey: ['posts'] });
			queryClient.invalidateQueries({ queryKey: ['users'] });
		}

		redirect('/');
	};

	return (
		<ConfirmationDialog
			title={t('profile.deleteProfile.title')}
			description={t('profile.deleteProfile.description')}
			remove={handleDelete}
			className={
				'bg-destructive px-5 py-1.5 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground'
			}
		/>
	);
}
