// lib/signalr/commentsHub.ts
import { CreateComment, UpdateComment, Comment } from '@/types/types';
import * as signalR from '@microsoft/signalr';
import { getSession } from 'next-auth/react';

let connection: signalR.HubConnection | null = null;

export const initCommentsHub = async () => {
	if (connection) return connection;

	const session = await getSession();

	connection = new signalR.HubConnectionBuilder()
		.withUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}/hubs/comments`, {
			accessTokenFactory: () => session?.accessToken ?? '',
			skipNegotiation: true,
			transport: signalR.HttpTransportType.WebSockets,
		})
		.withAutomaticReconnect()
		.build();

	connection
		.start()
		.then(() => console.log('Connected to SignalR hub'))
		.catch(err => console.error('Error connecting to SignalR', err));
	return connection;
};

export const joinPostGroup = async (postId: number) => {
	if (!connection) await initCommentsHub();
	await connection?.invoke('JoinPostGroup', postId);
};

export const leavePostGroup = async (postId: number) => {
	if (!connection) return;
	await connection.invoke('LeavePostGroup', postId);
};

export const sendComment = async (comment: CreateComment) => {
	if (!connection) return;
	await connection.invoke('SendComment', comment);
};

export const editComment = async (
	commentId: number,
	comment: UpdateComment,
	postId: number,
) => {
	if (!connection) return;
	await connection.invoke('EditComment', commentId, comment, postId);
};

export const deleteComment = async (commentId: number, postId: number) => {
	if (!connection) return;
	await connection.invoke('DeleteComment', commentId, postId);
};

export const onReceiveComment = (callback: (comment: Comment) => void) => {
	connection?.on('ReceiveComment', callback);
};

export const onUpdateComments = (callback: (comments: Comment[]) => void) => {
	connection?.on('UpdateComments', callback);
};
