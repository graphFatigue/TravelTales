'use client';

import { useEffect, useState } from 'react';
import { getLikesHubConnection } from '@/lib/signalr/likesHub';
import { useSession } from 'next-auth/react';

export function useLikes(
	postId: number,
	initialLikes: number,
	initialIsLiked: boolean,
) {
	const [likesCount, setLikesCount] = useState(initialLikes);
	const [isLiked, setIsLiked] = useState(initialIsLiked);
	const { data: session } = useSession();

	useEffect(() => {
		if (!session) return;
		let isMounted = true;

		const setupConnection = async () => {
			try {
				const connection = await getLikesHubConnection();
				const handler = (
					numOfLikes: number,
					isLiked: boolean,
					updatedPostId: number,
				) => {
					if (updatedPostId === postId && isMounted) {
						setLikesCount(numOfLikes);
						setIsLiked(isLiked);
					}
				};

				connection.on('ReceiveLikeUpdate', handler);

				return () => {
					connection.off('ReceiveLikeUpdate', handler);
				};
			} catch (error) {
				console.error('Failed to connect to LikesHub:', error);
			}
		};

		const cleanupPromise = setupConnection();

		return () => {
			isMounted = false;
			cleanupPromise.then(cleanup => cleanup?.());
		};
	}, [postId, session]);

	useEffect(() => {
		setIsLiked(initialIsLiked);
	}, [initialIsLiked]);

	const toggleLike = async () => {
		try {
			const connection = await getLikesHubConnection();
			await connection.invoke('SetLike', { postId });
		} catch (error) {
			console.error('Error toggling like:', error);
		}
	};

	return {
		likesCount,
		isLiked,
		toggleLike,
	};
}
