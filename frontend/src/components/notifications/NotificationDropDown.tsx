'use client';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { BellIcon } from 'lucide-react';
import { Notification } from '@/types/types';
import { redirect } from 'next/navigation';
import { useNotificationContext } from './NotificationProvider';
import { ScrollArea } from '../ui/scroll-area';
import UserAvatar from '../user/UserAvatar';

export const NotificationDropdown = () => {
	const { notifications, unreadCount, markAsRead, markAllAsRead } =
		useNotificationContext();

	const handleNotificationClick = async (notification: Notification) => {
		if (!notification.isRead) {
			await markAsRead(notification.id);
		}
		if (notification.postId) {
			redirect(`/post/${notification.postId}`);
		}
	};

	const getNotificationContent = (notification: Notification) => {
		if (notification.commentId) {
			return `commented on your post`;
		}
		if (notification.likedPostId) {
			return `liked your post`;
		}
		return notification.message;
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' size='icon' className='relative'>
					<BellIcon className='h-5 w-5' />
					{unreadCount > 0 && (
						<Badge className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0'>
							{unreadCount > 9 ? '9+' : unreadCount}
						</Badge>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-80 p-0' align='end'>
				<div className='flex items-center justify-between border-b px-3 py-2'>
					<h2 className='font-semibold'>Notifications</h2>
					{unreadCount > 0 && (
						<Button
							variant='link'
							size='sm'
							className='h-6 text-sm'
							onClick={() => markAllAsRead()}
						>
							Mark all as read
						</Button>
					)}
				</div>
				<ScrollArea className='h-72'>
					{notifications.length > 0 ? (
						notifications.map(notification => (
							<DropdownMenuItem
								key={notification.id}
								className='flex items-start gap-3 px-3 py-3 hover:bg-muted/50'
								onClick={() => handleNotificationClick(notification)}
							>
								<UserAvatar
									avatarUrl={notification.triggeredByBlogger?.image}
								/>
								<div className='flex-1'>
									<div className='flex items-center justify-between'>
										<p className='text-sm font-medium'>
											{notification.triggeredByBlogger?.firstName}{' '}
											{notification.triggeredByBlogger?.lastName}
										</p>
										{!notification.isRead && (
											<span className='h-2 w-2 rounded-full bg-primary' />
										)}
									</div>
									<p className='text-sm text-muted-foreground'>
										{getNotificationContent(notification)}
									</p>
									<p className='mt-1 text-xs text-muted-foreground'>
										{formatDistanceToNow(new Date(notification.createdAt), {
											addSuffix: true,
										})}
									</p>
								</div>
							</DropdownMenuItem>
						))
					) : (
						<div className='py-6 text-center text-sm text-muted-foreground'>
							No notifications yet
						</div>
					)}
				</ScrollArea>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
