import UserButton from '@/components/UserButton';
import Link from 'next/link';

export default function Navbar() {
	return (
		<header className="shadoww-sm sticky top-0 z-10 bg-card">
			<div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
				<Link href="/" className="text-2xl font-bold text-primary">
					TravelTales
				</Link>
				<UserButton className="sm:ms-auto" />
			</div>
		</header>
	);
}
