import * as signalR from '@microsoft/signalr';
import { getSession } from 'next-auth/react';

let connection: signalR.HubConnection | null = null;

export const getLikesHubConnection = async () => {
	if (connection) return connection;

	const session = await getSession();

	connection = new signalR.HubConnectionBuilder()
		.withUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}/hubs/likes`, {
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
