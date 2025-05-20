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
} from '../ui/dropdown-menu';
import Link from 'next/link';
import { Check, LogOutIcon, Monitor, Moon, Sun, UserIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import UserAvatar from '../UserAvatar';
import { signOut } from 'next-auth/react';
import { User } from '@/types/user';
import { useQueryClient } from '@tanstack/react-query';

interface UserButtonProps {
	user: User;
	className?: string;
}

export default function UserButton({ user, className }: UserButtonProps) {
	const { theme, setTheme } = useTheme();
	const queryClient = useQueryClient();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className={cn('flex-none rounded-full', className)}>
					<UserAvatar avatarUrl={user.image} size={40} />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>
					Logged in as{' '}
					{user.blogger?.firstName + ' ' + user.blogger?.lastName || 'unknown'}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<Link href={`/blogger/${user.blogger?.id}`}>
					<DropdownMenuItem>
						<UserIcon className='mr-2 size-4' /> Profile
					</DropdownMenuItem>
				</Link>
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<Monitor className='mr-2 size-4' /> Theme
					</DropdownMenuSubTrigger>
					<DropdownMenuPortal>
						<DropdownMenuSubContent>
							<DropdownMenuItem onClick={() => setTheme('system')}>
								<Monitor className='mr-2 size-4' />
								System default
								{theme === 'system' && <Check className='ms-2 size-4' />}
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme('light')}>
								<Sun className='mr-2 size-4' />
								Light
								{theme === 'light' && <Check className='ms-2 size-4' />}
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme('dark')}>
								<Moon className='mr-2 size-4' />
								Dark
								{theme === 'dark' && <Check className='ms-2 size-4' />}
							</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuPortal>
				</DropdownMenuSub>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						queryClient.clear();
						signOut();
					}}
				>
					<LogOutIcon className='mr-2 size-4' /> Logout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
