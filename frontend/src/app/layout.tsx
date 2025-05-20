import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import AuthProvider from '@/components/AuthProvider';
import ReactQueryProvider from './QueryProvider';

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
							defaultTheme='system'
							enableSystem
							disableTransitionOnChange
						>
							{children}
						</ThemeProvider>
						<Toaster position='bottom-left' />
					</AuthProvider>
				</ReactQueryProvider>
			</body>
		</html>
	);
}
