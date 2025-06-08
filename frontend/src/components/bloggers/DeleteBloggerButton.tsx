import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signOut, useSession } from 'next-auth/react';
import api from '@/lib/api/api';
import { toast } from 'sonner';
import ConfirmationDialog from '../ConfirmationDialog';
import { redirect } from 'next/navigation';

interface DeleteBloggerButtonProps {
	bloggerId: number;
}

export function DeleteBloggerButton({ bloggerId }: DeleteBloggerButtonProps) {
	const queryClient = useQueryClient();
	const { data: session } = useSession();

	const deleteBloggerMutation = useMutation({
		mutationFn: async () => {
			await api.delete(`/api/Blogger/${bloggerId}`);
		},
		onSuccess: async () => {
			await queryClient.removeQueries({ queryKey: ['blogger', bloggerId] });

			queryClient.invalidateQueries({ queryKey: ['bloggers'] });
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onError: (error: any) => {
			console.error('Failed to delete blogger:', error);
			toast.error('Failed to delete blogger.');
		},
	});

	const handleDelete = async () => {
		deleteBloggerMutation.mutate();

		if (session?.user?.blogger?.id === bloggerId) {
			await signOut({ callbackUrl: '/' });
		} else {
			redirect('/');
		}
	};

	return (
		<ConfirmationDialog
			title='Delete Profile'
			description='Are you sure you want to delete your profile? This action cannot be undone.'
			remove={handleDelete}
			className={
				'bg-destructive px-5 py-1.5 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground'
			}
		/>
	);
}
