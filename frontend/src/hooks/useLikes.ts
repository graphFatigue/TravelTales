'use client';

import { useEffect, useState } from 'react';
import { getLikesHubConnection } from '@/lib/signalr/likesHub';

export function useLikes(
	postId: number,
	initialLikes: number,
	initialIsLiked: boolean,
) {
	const [likesCount, setLikesCount] = useState(initialLikes);
	const [isLiked, setIsLiked] = useState(initialIsLiked);

	useEffect(() => {
		let isMounted = true;

		const setupConnection = async () => {
			try {
				const connection = await getLikesHubConnection();

				// Subscribe to like updates
				const handler = (
					numOfLikes: number,
					liked: boolean,
					updatedPostId: number,
				) => {
					if (updatedPostId === postId && isMounted) {
						setLikesCount(numOfLikes);
						setIsLiked(liked);
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
			// Clean up after connection is initialized
			cleanupPromise.then(cleanup => cleanup?.());
		};
	}, [postId]);

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
