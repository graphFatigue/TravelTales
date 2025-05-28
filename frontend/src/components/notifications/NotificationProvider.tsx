'use client';

import { useNotifications } from '@/hooks/posts/useNotifications';
import { Notification } from '@/types/types';
import {
	ReactNode,
	createContext,
	useContext,
} from 'react';

type NotificationContextType = {
	notifications: Notification[];
	unreadCount: number;
	isLoading: boolean;
	isError: boolean;
	markAsRead: (notificationId: number) => Promise<void>;
	markAllAsRead: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
	undefined,
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
	const {
		notifications,
		isLoading,
		isError,
		markAsRead,
		markAllAsRead,
	} = useNotifications();

	const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

	return (
		<NotificationContext.Provider
			value={{
				notifications,
				unreadCount,
				isLoading,
				isError,
				markAsRead,
				markAllAsRead,
			}}
		>
			{children}
		</NotificationContext.Provider>
	);
};

export const useNotificationContext = () => {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error(
			'useNotificationContext must be used within a NotificationProvider',
		);
	}
	return context;
};
