import { useDeletePost } from '@/hooks/posts/useDeletePost';
import ConfirmationDialog from '../ConfirmationDialog';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface DeletePostProps {
	postId: number;
	className?: string;
}

export default function DeletePost({ postId, className }: DeletePostProps) {
	const deletePostMutation = useDeletePost(postId);
	const router = useRouter();
	const { t } = useTranslation();

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
			title={t('post.deleteConfirm')}
			description={t('post.deleteDescription')}
			remove={handleDelete}
			className={className}
		/>
	);
}
