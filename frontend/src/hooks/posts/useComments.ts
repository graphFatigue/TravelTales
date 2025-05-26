/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import {
	initCommentsHub,
	joinPostGroup,
	leavePostGroup,
	onCommentReceived,
	onCommentUpdated,
	sendComment,
	editComment,
	deleteComment,
} from '@/lib/signalr/commentsHub';
import { CreateComment, UpdateComment, Comment } from '@/types/types';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/api';

export const useComments = ({ postId }: { postId: number }) => {
	const queryClient = useQueryClient();

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useInfiniteQuery({
			queryKey: ['comments', postId],
			queryFn: async ({ pageParam = 1 }) => {
				const response = await api.get(`/api/Comments/filter`, {
					params: {
						PageSize: 3,
						Page: pageParam,
						Filters: `postId==${postId}`,
					},
				});
				return response.data;
			},
			getNextPageParam: lastPage => {
				return lastPage.hasNext ? lastPage.currentPage + 1 : undefined;
			},
			initialPageParam: 1,
		});

	useEffect(() => {
		const setupHub = async () => {
			await initCommentsHub();
			await joinPostGroup(postId);

			onCommentReceived(comment => {
				if (comment.postId === postId) {
					queryClient.setQueryData(['comments', postId], (old: any) => {
						if (!old) return old;
						const firstPageItems = old.pages[0]?.items || [];
						const exists = firstPageItems.some(
							(c: Comment) => c.id === comment.id,
						);

						if (!exists) {
							return {
								...old,
								pages: old.pages.map((page: any, i: number) =>
									i === 0 ? { ...page, items: [comment, ...page.items] } : page,
								),
							};
						}
						return old;
					});
				}
			});

			onCommentUpdated((data: Comment | Comment[]) => {
				queryClient.setQueryData(['comments', postId], (old: any) => {
					if (!old) return old;

					if (Array.isArray(data)) {
						const oldComments = old.pages.flatMap((page: {items: Comment[]}) => page.items);
						const deletedCommentId = oldComments.find(
							(oldComment: Comment) =>
								!data.some(newComment => newComment.id === oldComment.id),
						)?.id;

						if (deletedCommentId) {
							return {
								...old,
								pages: old.pages.map(
									(page: { items: Comment[]; totalCount: number }) => ({
										...page,
										items: page.items.filter(
											comment => comment.id !== deletedCommentId,
										),
										totalCount: page.totalCount - 1,
									}),
								),
							};
						}
						return old;
					}

					return {
						...old,
						pages: old.pages.map((page: any) => ({
							...page,
							items: page.items.map((comment: Comment) =>
								comment.id === data.id ? data : comment,
							),
						})),
					};
				});
			});
		};

		setupHub();

		return () => {
			leavePostGroup(postId);
		};
	}, [postId, queryClient]);

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
		comments: data?.pages.flatMap(page => page.items) || [],
		send,
		edit,
		remove,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	};
};
