import { useDeletePost } from '@/hooks/useDeletePost';
import ConfirmationDialog from '../ConfirmationDialog';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface DeletePostProps {
	postId: number;
	className?: string;
}

export default function DeletePost({ postId, className }: DeletePostProps) {
	const deletePostMutation = useDeletePost(postId);
	const router = useRouter();

	const handleDelete = () => {
		deletePostMutation.mutate();
	};

	useEffect(() => {
		if (deletePostMutation.isSuccess) {
			router.push('/');
		}
	}, [deletePostMutation.isSuccess, router]);

	return (
		<ConfirmationDialog
			title='Delete Post'
			description='Are you sure you want to delete this post? This action cannot be undone.'
			remove={handleDelete}
			className={className}
		/>
	);
}
