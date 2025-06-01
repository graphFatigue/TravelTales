import UserButtons from '@/components/userButtons/UserButtons';
import Link from 'next/link';

export default function Navbar() {
	return (
		<header className="shadoww-sm sticky top-0 z-10 bg-card">
			<div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-3">
				<Link href="/" className="text-2xl font-bold text-primary">
					TravelTales
				</Link>
				<UserButtons/>
			</div>
		</header>
	);
}
