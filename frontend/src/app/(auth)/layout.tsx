export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	//check auth token. registered user redirected to profile page
	return <>{children}</>;
}
