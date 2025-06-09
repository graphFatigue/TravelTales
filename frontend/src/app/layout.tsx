import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import AuthProvider from '@/components/AuthProvider';
import ReactQueryProvider from './QueryProvider';
import I18nProvider from '@/components/I18nProvider';
import { NotificationProvider } from '@/components/notifications/NotificationProvider';

export const metadata: Metadata = {
	title: 'TravelTales',
	description: 'Social media for travelers',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body>
				<ReactQueryProvider>
					<AuthProvider>
						<ThemeProvider
							attribute='class'
							defaultTheme='light'
							enableSystem
							disableTransitionOnChange
						>
							<I18nProvider>
								<NotificationProvider>{children}</NotificationProvider>
								<Toaster position='bottom-left' />
							</I18nProvider>
						</ThemeProvider>
					</AuthProvider>
				</ReactQueryProvider>
			</body>
		</html>
	);
}
