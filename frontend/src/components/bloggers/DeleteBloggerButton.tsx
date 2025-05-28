import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signOut } from 'next-auth/react';
import api from '@/lib/api/api';
import { toast } from 'sonner';
import ConfirmationDialog from '../ConfirmationDialog';

interface DeleteBloggerButtonProps {
	bloggerId: number;
}

export function DeleteBloggerButton({ bloggerId }: DeleteBloggerButtonProps) {
	const queryClient = useQueryClient();

	const deleteBloggerMutation = useMutation({
		mutationFn: async () => {
			await api.delete(`/api/Blogger/${bloggerId}`);
		},
		onSuccess: async () => {
			await queryClient.removeQueries({ queryKey: ['blogger', bloggerId] });

			await signOut({ callbackUrl: '/' });

			queryClient.invalidateQueries({ queryKey: ['bloggers'] });
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onError: (error: any) => {
			console.error('Failed to delete blogger:', error);
			toast.error('Failed to delete blogger.');
		},
	});

	const handleDelete = () => {
		deleteBloggerMutation.mutate();
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
