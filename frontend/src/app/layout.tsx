import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import AuthProvider from '@/components/AuthProvider';
import ReactQueryProvider from './QueryProvider';
import I18nProvider from '@/components/I18nProvider';

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
							<I18nProvider>{children}</I18nProvider>
						</ThemeProvider>
						<Toaster position='bottom-left' />
					</AuthProvider>
				</ReactQueryProvider>
			</body>
		</html>
	);
}
