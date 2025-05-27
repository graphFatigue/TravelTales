"use client";

import { Button } from '@/components/ui/button';
import { Home, UserRoundCheck, UserRoundPlus, Users, ContactRound, ChartBarStacked  } from 'lucide-react';
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
				className='flex items-center justify-start gap-3'
				title='Home'
				asChild
			>
				<Link href='/'>
					<Home />
					<span className='hidden lg:inline'>{t('dashboard.home')}</span>
				</Link>
			</Button>
			<Button
				variant='ghost'
				className='flex items-center justify-start gap-3'
				title='Bloggers'
				asChild
			>
				<Link href='/blogger'>
					<Users />
					<span className='hidden lg:inline'>{t('dashboard.bloggers')}</span>
				</Link>
			</Button>

			{session?.role === "Admin" && (
				<>
					<Button
						variant='ghost'
						className='flex items-center justify-start gap-3'
						title='Users'
						asChild
					>
						<Link href={`/admin/users`}>
							<ContactRound />
							<span className='hidden lg:inline'>{t('dashboard.users')}</span>
						</Link>
					</Button>
					<Button
						variant='ghost'
						className='flex items-center justify-start gap-3'
						title='Categories'
						asChild
					>
						<Link href={`/admin/categories`}>
							<ChartBarStacked />
							<span className='hidden lg:inline'>
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
						className='flex items-center justify-start gap-3'
						title='Followers'
						asChild
					>
						<Link href={`/blogger/${session?.user.blogger?.id}/followers`}>
							<UserRoundPlus />
							<span className='hidden lg:inline'>
								{t('dashboard.followers')}
							</span>
						</Link>
					</Button>
					<Button
						variant='ghost'
						className='flex items-center justify-start gap-3'
						title='Following'
						asChild
					>
						<Link href={`/blogger/${session?.user.blogger?.id}/following`}>
							<UserRoundCheck />
							<span className='hidden lg:inline'>
								{t('dashboard.following')}
							</span>
						</Link>
					</Button>
					<Button
						variant='ghost'
						className='flex items-center justify-start gap-3'
						title='Notifications'
						asChild
					>
					</Button>
				</>
			)}
		</div>
	);
}
