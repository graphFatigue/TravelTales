'use client';
import { Button } from '@/components/ui/button';
import { Bell, Home, ChartLine, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface MenuBarProps {
	className?: string;
}

export default function MenuBar({ className }: MenuBarProps) {
	const [user, setUser] = useState<{
		username?: string;
		email?: string;
		password?: string;
		avatarUrl?: string;
	}>({});

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
			setUser(storedUser);
		}
	}, []);
	return (
		<div className={className}>
			<Button
				variant="ghost"
				className="flex items-center justify-start gap-3"
				title="Home"
				asChild
			>
				<Link href="/">
					<Home />
					<span className="hidden lg:inline">Home</span>
				</Link>
			</Button>
			<Button
				variant="ghost"
				className="flex items-center justify-start gap-3"
				title="Notifications"
				asChild
			>
				<Link href={`/users/${user.username}/statistics`}>
					<ChartLine />
					<span className="hidden lg:inline">Statistics</span>
				</Link>
			</Button>
			<Button
				variant="ghost"
				className="flex items-center justify-start gap-3"
				title="Notifications"
				asChild
			>
				<Link href={`/users/${user.username}/notifications`}>
					<Bell />
					<span className="hidden lg:inline">Notifications</span>
				</Link>
			</Button>
			<Button
				variant="ghost"
				className="flex items-center justify-start gap-3"
				title="Notifications"
				asChild
			>
				<Link href={`/users/${user.username}/saved`}>
					<Bookmark />
					<span className="hidden lg:inline">Saved Posts</span>
				</Link>
			</Button>
		</div>
	);
}
