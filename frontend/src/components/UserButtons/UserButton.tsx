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
import UserAvatar from '../user/UserAvatar';
import { signOut, useSession } from 'next-auth/react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useBlogger } from '@/hooks/bloggers/useBlogger';
import { redirect } from 'next/navigation';

interface UserButtonProps {
	className?: string;
}

export default function UserButton({ className }: UserButtonProps) {
	const { theme, setTheme } = useTheme();
	const queryClient = useQueryClient();
	const { t } = useTranslation();
	const { data: session } = useSession();

	const { data: blogger } = useBlogger(session?.user.blogger?.id);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className={cn('flex-none rounded-full', className)}>
					<UserAvatar avatarUrl={blogger?.image} size={40} />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>
					{t('dashboard.logedinAs', {
						name:
							blogger?.firstName +
								' ' +
								blogger?.lastName || 'unknown',
					})}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<Link href={`/blogger/${session?.user.blogger?.id}`}>
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
						redirect('/');
					}}
				>
					<LogOutIcon className='mr-2 size-4' /> {t('auth.logout')}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
