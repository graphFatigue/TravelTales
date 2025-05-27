'use client';

import { useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import api from '@/lib/api/api';
import {
    getNotificationsConnection,
	joinNotificationGroup,
	onNotificationReceived,
} from '@/lib/signalr/notificationsHub';
import { useSession } from 'next-auth/react';
import { Notification } from '@/types/types';

interface NotificationsResponse {
	items: Notification[];
	currentPage: number;
	totalPages: number;
	pageSize: number;
	totalCount: number;
	hasPrevious: boolean;
	hasNext: boolean;
}

export const useNotifications = () => {
	const { data: session } = useSession();
	const queryClient = useQueryClient();
	const bloggerId = session?.user?.blogger?.id;

	const { data, isLoading, isError } = useQuery<Notification[]>({
		queryKey: ['notifications', bloggerId],
		queryFn: async () => {
			const response = await api.get<NotificationsResponse>(
				`/api/Notifications`,
				{
					params: {
						Sorts: '-createdAt',
					},
				},
			);
			return response.data.items;
		},
		enabled: !!bloggerId,
		select: data => data || [],
	});

	const markAsReadMutation = useMutation({
		mutationFn: async (notificationId: number) => {
			await api.put(`/api/Notifications/${notificationId}/read`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['notifications', bloggerId],
			});
		},
	});

	useEffect(() => {
		if (!bloggerId) return;

		let isMounted = true;

		const handleNewNotification = (newNotification: Notification) => {
			if (isMounted && newNotification.recipientBloggerId === bloggerId) {
				queryClient.setQueryData<Notification[]>(
					['notifications', bloggerId],
					(old = []) => {
						const exists = old.some(n => n.id === newNotification.id);
						return exists ? old : [newNotification, ...old];
					},
				);
			}
		};

		const setupConnection = async () => {
			try {
				await getNotificationsConnection();

				onNotificationReceived(handleNewNotification);

				await joinNotificationGroup();
			} catch (error) {
				console.error('Notification hub setup failed:', error);
			}
		};

		setupConnection();

		return () => {
			isMounted = false;
		};
	}, [bloggerId, queryClient]);

	const markAllAsReadMutation = useMutation({
		mutationFn: async () => {
			await api.post('/api/Notifications/mark-all-read');
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['notifications', bloggerId],
			});
		},
	});

	return {
		notifications: data || [],
		isLoading,
		isError,
		markAsRead: markAsReadMutation.mutateAsync,
		markAllAsRead: markAllAsReadMutation.mutateAsync,
	};
};
