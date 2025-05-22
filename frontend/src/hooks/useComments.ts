import { useEffect, useState } from 'react';
import {
	initCommentsHub,
	joinPostGroup,
	leavePostGroup,
	onReceiveComment,
	onUpdateComments,
	sendComment,
	editComment,
	deleteComment,
} from '@/lib/signalr/commentsHub';
import { Comment, CreateComment, UpdateComment } from '@/types/types';

export const useComments = ({postId, initialComments}:{postId: number, initialComments: Comment[]}) => {
	const [comments, setComments] = useState<Comment[]>(initialComments);

	useEffect(() => {
		const setupHub = async () => {
			await initCommentsHub();
			await joinPostGroup(postId);

			onReceiveComment(comment => {
				setComments(prev => [...prev, comment]);
			});

			onUpdateComments(updatedComments => {
				setComments(updatedComments);
			});
		};

		setupHub();

		return () => {
			leavePostGroup(postId);
		};
	}, [postId]);

	const send = async (newComment: CreateComment) => {
		await sendComment(newComment);
	};

	const edit = async (commentId: number, data: UpdateComment) => {
		await editComment(commentId, data, postId);
	};

	const remove = async (commentId: number) => {
		await deleteComment(commentId, postId);
	};

	return {
		comments,
		send,
		edit,
		remove,
	};
};
