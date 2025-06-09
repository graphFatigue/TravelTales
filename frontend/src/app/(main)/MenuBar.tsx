"use client";

import { Button } from '@/components/ui/button';
import { Home, UserRoundCheck, UserRoundPlus, Users, ContactRound, ChartBarStacked, NotebookText  } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface MenuBarProps {
	className?: string;
}

export default function MenuBar({ className }: MenuBarProps) {
	const { data: session } = useSession();
	const {t} = useTranslation();
	return (
		<div className={className}>
			<Button
				variant='ghost'
				className='flex h-9 w-9 items-center justify-center gap-2 p-0 sm:h-10 sm:w-auto sm:justify-start sm:gap-3 sm:px-3'
				title={t('dashboard.home')}
				asChild
			>
				<Link href='/'>
					<Home className='h-4 w-4 sm:h-5 sm:w-5' />
					<span className='hidden sm:inline text-sm'>{t('dashboard.home')}</span>
				</Link>
			</Button>
			<Button
				variant='ghost'
				className='flex h-9 w-9 items-center justify-center gap-2 p-0 sm:h-10 sm:w-auto sm:justify-start sm:gap-3 sm:px-3'
				title={t('dashboard.bloggers')}
				asChild
			>
				<Link href='/blogger'>
					<Users className='h-4 w-4 sm:h-5 sm:w-5' />
					<span className='hidden sm:inline text-sm'>{t('dashboard.bloggers')}</span>
				</Link>
			</Button>

			{session?.role === 'Admin' && (
				<>
					<Button
						variant='ghost'
						className='flex h-9 w-9 items-center justify-center gap-2 p-0 sm:h-10 sm:w-auto sm:justify-start sm:gap-3 sm:px-3'
						title={t('dashboard.users')}
						asChild
					>
						<Link href={`/admin/users`}>
							<ContactRound className='h-4 w-4 sm:h-5 sm:w-5' />
							<span className='hidden sm:inline text-sm'>{t('dashboard.users')}</span>
						</Link>
					</Button>
					<Button
						variant='ghost'
						className='flex h-9 w-9 items-center justify-center gap-2 p-0 sm:h-10 sm:w-auto sm:justify-start sm:gap-3 sm:px-3'
						title={t('dashboard.categories')}
						asChild
					>
						<Link href={`/admin/categories`}>
							<ChartBarStacked className='h-4 w-4 sm:h-5 sm:w-5' />
							<span className='hidden sm:inline text-sm'>
								{t('dashboard.categories')}
							</span>
						</Link>
					</Button>
				</>
			)}

			{session?.user && (
				<>
					<Button
						variant='ghost'
						className='flex h-9 w-9 items-center justify-center gap-2 p-0 sm:h-10 sm:w-auto sm:justify-start sm:gap-3 sm:px-3'
						title={t('dashboard.followersPosts')}
						asChild
					>
						<Link href={`/blogger/${session?.user.blogger?.id}/followers/posts`}>
							<NotebookText className='h-4 w-4 sm:h-5 sm:w-5' />
							<span className='hidden sm:inline text-sm'>
								{t('dashboard.followersPosts')}
							</span>
						</Link>
					</Button>
					<Button
						variant='ghost'
						className='flex h-9 w-9 items-center justify-center gap-2 p-0 sm:h-10 sm:w-auto sm:justify-start sm:gap-3 sm:px-3'
						title={t('dashboard.followers')}
						asChild
					>
						<Link href={`/blogger/${session?.user.blogger?.id}/followers`}>
							<UserRoundPlus className='h-4 w-4 sm:h-5 sm:w-5' />
							<span className='hidden sm:inline text-sm'>
								{t('dashboard.followers')}
							</span>
						</Link>
					</Button>
					<Button
						variant='ghost'
						className='flex h-9 w-9 items-center justify-center gap-2 p-0 sm:h-10 sm:w-auto sm:justify-start sm:gap-3 sm:px-3'
						title={t('dashboard.following')}
						asChild
					>
						<Link href={`/blogger/${session?.user.blogger?.id}/following`}>
							<UserRoundCheck className='h-4 w-4 sm:h-5 sm:w-5' />
							<span className='hidden sm:inline text-sm'>
								{t('dashboard.following')}
							</span>
						</Link>
					</Button>
					<Button
						variant='ghost'
						className='flex items-center justify-start gap-3'
						title='Notifications'
						asChild
					></Button>
				</>
			)}
		</div>
	);
}
