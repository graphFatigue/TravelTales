/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signOut, useSession } from 'next-auth/react';
import api from '@/lib/api/api';
import { toast } from 'sonner';
import ConfirmationDialog from '../ConfirmationDialog';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

interface DeleteBloggerButtonProps {
	bloggerId: number;
}

export function DeleteBloggerButton({ bloggerId }: DeleteBloggerButtonProps) {
	const queryClient = useQueryClient();
	const { data: session } = useSession();
	const { t } = useTranslation();
	const router = useRouter();

	const deleteBloggerMutation = useMutation({
		mutationFn: async () => {
			await api.delete(`/api/Blogger/${bloggerId}`);
		},
		onSuccess: async () => {
			toast.success(t('profile.deleteProfile.successedDelete'));
			if (session?.user?.blogger?.id === bloggerId) {
				await signOut({ callbackUrl: '/' });
			}
			queryClient.removeQueries({ queryKey: ['blogger', bloggerId] });
			queryClient.invalidateQueries({ queryKey: ['bloggers'] });
			queryClient.invalidateQueries({ queryKey: ['users'] });
			queryClient.removeQueries({
				queryKey: ['notifications', bloggerId],
			});
			queryClient.invalidateQueries({ queryKey: ['posts'] });
			if (session?.user?.blogger?.id !== bloggerId) {
				router.push('/');
			}
		},
		onError: (error: any) => {
			console.error('Failed to delete blogger:', error);
			toast.error(t('profile.deleteProfile.failedDelete'));
		},
	});

	const handleDelete = async () => {
		await deleteBloggerMutation.mutate();
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
