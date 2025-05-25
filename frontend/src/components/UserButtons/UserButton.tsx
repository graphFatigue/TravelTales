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
import { User } from '@/types/types';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

interface UserButtonProps {
	user: User;
	className?: string;
}

export default function UserButton({ user, className }: UserButtonProps) {
	const { theme, setTheme } = useTheme();
	const queryClient = useQueryClient();
	const { t } = useTranslation();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className={cn('flex-none rounded-full', className)}>
					<UserAvatar avatarUrl={user.image} size={40} />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>
					{t('dashboard.logedinAs', {
						name:
							user.blogger?.firstName + ' ' + user.blogger?.lastName ||
							'unknown',
					})}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<Link href={`/blogger/${user.blogger?.id}`}>
					<DropdownMenuItem>
						<UserIcon className='mr-2 size-4' /> {t('dashboard.profile')}
					</DropdownMenuItem>
				</Link>
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<Monitor className='mr-2 size-4' /> {t('dashboard.theme')}
					</DropdownMenuSubTrigger>
					<DropdownMenuPortal>
						<DropdownMenuSubContent>
							<DropdownMenuItem onClick={() => setTheme('system')}>
								<Monitor className='mr-2 size-4' />
								{t('dashboard.system')}
								{theme === 'system' && <Check className='ms-2 size-4' />}
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme('light')}>
								<Sun className='mr-2 size-4' />
								{t('dashboard.light')}
								{theme === 'light' && <Check className='ms-2 size-4' />}
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme('dark')}>
								<Moon className='mr-2 size-4' />
								{t('dashboard.dark')}
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
					<LogOutIcon className='mr-2 size-4' /> {t('auth.logout')}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
