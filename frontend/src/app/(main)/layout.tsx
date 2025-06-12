import Navbar from './Navbar';
import MenuBar from './MenuBar';

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className='flex min-h-screen flex-col'>
			<Navbar />
			<div className='mx-auto flex w-full max-w-7xl grow gap-5 p-5'>
				<MenuBar className='xl:w-88 sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5' />

				<main className='h-[200vh] w-full'>
					<div className='w-full'>{children}</div>
				</main>
			</div>
			<div className='sticky bottom-0 z-50 w-full border-t bg-card sm:hidden p-3'>
				<MenuBar className='flex w-full justify-center gap-5' />
			</div>
		</div>
	);
}
