import { CreateComment, UpdateComment, Comment } from '@/types/types';
import * as signalR from '@microsoft/signalr';
import { getSession } from 'next-auth/react';

let connection: signalR.HubConnection | null = null;

const listeners: {
	onCommentReceived?: (comment: Comment) => void;
	onCommentUpdated?: (comment: Comment) => void;
} = {};

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

	connection.onclose(async error => {
		console.log(
			'CommentsHub connection closed. Attempting to reconnect...',
			error,
		);
	});

	connection.onreconnected(() => {
		console.log('CommentsHub reconnected');
		attachListeners();
	});

	try {
		await connection.start();
		console.log('Connected to CommentsHub');
		attachListeners();
	} catch (err) {
		console.error('Error connecting to CommentsHub:', err);
		throw err;
	}

	return connection;
};

const attachListeners = () => {
	if (!connection) return;

	if (listeners.onCommentReceived) {
		connection.off('ReceiveComment');
		connection.on('ReceiveComment', listeners.onCommentReceived);
	}

	if (listeners.onCommentUpdated) {
		connection.off('UpdateComments');
		connection.on('UpdateComments', listeners.onCommentUpdated);
	}
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

export const onCommentReceived = (callback: (comment: Comment) => void) => {
	listeners.onCommentReceived = callback;
	if (connection?.state === signalR.HubConnectionState.Connected) {
		connection.off('ReceiveComment');
		connection.on('ReceiveComment', callback);
	}
};

export const onCommentUpdated = (callback: (comment: Comment) => void) => {
	listeners.onCommentUpdated = callback;
	if (connection?.state === signalR.HubConnectionState.Connected) {
		connection.off('UpdateComments');
		connection.on('UpdateComments', callback);
	}
};
