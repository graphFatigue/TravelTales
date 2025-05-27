import { Notification } from '@/types/types';
import * as signalR from '@microsoft/signalr';
import { getSession } from 'next-auth/react';

let connection: signalR.HubConnection | null = null;
let isInitializing = false;

const listeners: {
	onNotificationReceived?: (notification: Notification) => void;
} = {};

export const getNotificationsConnection = async () => {
	if (connection) return connection;
	if (isInitializing) {
		await new Promise(resolve => setTimeout(resolve, 500));
		return connection;
	}

	isInitializing = true;

	try {
		const session = await getSession();
		if (!session?.accessToken) {
			throw new Error('No access token available');
		}

		connection = new signalR.HubConnectionBuilder()
			.withUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}/hubs/notifications`, {
				accessTokenFactory: () => session?.accessToken ?? '',
				skipNegotiation: true,
				transport: signalR.HttpTransportType.WebSockets,
			})
			.withAutomaticReconnect({
				nextRetryDelayInMilliseconds: retryContext => {
					return Math.min(retryContext.elapsedMilliseconds * 2, 30000);
				},
			})
			.configureLogging(signalR.LogLevel.Warning)
			.build();

		connection.onclose(error => {
			console.log('NotificationsHub connection closed', error);
		});

		connection.onreconnected(connectionId => {
			console.log('SignalR reconnected with ID:', connectionId);
			joinNotificationGroup();
		});

		await connection.start();
		console.log(
			'Connected to Notifications Hub with ID:',
			connection.connectionId,
		);

		await joinNotificationGroup();

		return connection;
	} catch (error) {
		console.error('Error initializing SignalR connection:', error);
		throw error;
	} finally {
		isInitializing = false;
	}
};

export const joinNotificationGroup = async () => {
	const connection = await getNotificationsConnection();
	try {
		await connection?.invoke('JoinNotificationGroup');
		console.log('Successfully joined notification group');
	} catch (error) {
		console.error('Error joining notification group:', error);
	}
};

export const onNotificationReceived = (
	callback: (notification: Notification) => void,
) => {
	listeners.onNotificationReceived = callback;

	if (connection) {
		connection.off('ReceiveNotification');
		// for comments notification I receive Comment object (createCommentDTO on backend)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		connection.on('ReceiveNotification', (message: string, data?: any) => {
			const notification: Notification = {
				id: Date.now(),
				message,
				isRead: false,
				createdAt: new Date().toISOString(),
				recipientBloggerId: data?.postAuthorBloggerId || 0,
				triggeredByBlogger: {
					id: data?.bloggerId || 0,
					image: data?.bloggerImage,
					firstName: data?.bloggerName?.split(' ')[0] || '',
					lastName: data?.bloggerName?.split(' ')[1] || '',
				},
				postId: data?.postId || 0,
				commentId: data?.id || 0,
				likedPostId: data?.likedPostId || 0,
			};
			callback(notification);
		});
	}
};
