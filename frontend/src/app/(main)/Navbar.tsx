import UserButtons from '@/components/userButtons/UserButtons';
import Link from 'next/link';

export default function Navbar() {
	return (
		<header className="sticky top-0 z-10 bg-card shadow-sm">
			<div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-3 py-2 sm:gap-5 sm:px-5 sm:py-3">
				<Link href="/" className="text-lg font-bold text-primary sm:text-2xl">
					TravelTales
				</Link>
				<UserButtons/>
			</div>
		</header>
	);
}
