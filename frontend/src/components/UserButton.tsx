'use client';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuLabel,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuPortal,
	DropdownMenuSubContent,
} from './ui/dropdown-menu';
import Link from 'next/link';
import { Check, LogOutIcon, Monitor, Moon, Sun, UserIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { logout } from '@/app/(auth)/action';
import UserAvatar from './UserAvatar';
import { useEffect, useState } from 'react';
interface UserButtonProps {
	className?: string;
}

export default function UserButton({ className }: UserButtonProps) {
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
	const { theme, setTheme } = useTheme();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className={cn('flex-none rounded-full', className)}>
					<UserAvatar avatarUrl={user?.avatarUrl} size={40} />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>
					Logged in as @{user?.username || 'unknown'}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<Link href={`/users/${user.username}`}>
					<DropdownMenuItem>
						<UserIcon className="mr-2 size-4" /> Profile
					</DropdownMenuItem>
				</Link>
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<Monitor className="mr-2 size-4" /> Theme
					</DropdownMenuSubTrigger>
					<DropdownMenuPortal>
						<DropdownMenuSubContent>
							<DropdownMenuItem
								onClick={() => setTheme('system')}
							>
								<Monitor className="mr-2 size-4" />
								System default
								{theme === 'system' && (
									<Check className="ms-2 size-4" />
								)}
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme('light')}>
								<Sun className="mr-2 size-4" />
								Light
								{theme === 'light' && (
									<Check className="ms-2 size-4" />
								)}
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme('dark')}>
								<Moon className="mr-2 size-4" />
								Dark
								{theme === 'dark' && (
									<Check className="ms-2 size-4" />
								)}
							</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuPortal>
				</DropdownMenuSub>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						logout();
					}}
				>
					<LogOutIcon className="mr-2 size-4" /> Logout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
