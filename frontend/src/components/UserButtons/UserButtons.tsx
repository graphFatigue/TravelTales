'use client';

import { useSession } from 'next-auth/react';
import UserButton from './UserButton';
import { Button } from '../ui/button';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { NotificationDropdown } from '../notifications/NotificationDropDown';
import ThemeDropdown from '../ThemeDropdown';

export default function UserButtons() {
	const { data: session } = useSession();
	const { t } = useTranslation();
	return (
		<div className='flex items-center gap-2 sm:gap-4'>
			<LanguageSwitcher />
			{session ? (
				<>
					<NotificationDropdown />
					<UserButton />
				</>
			) : (
				<div className='flex gap-2 sm:gap-4'>
					<ThemeDropdown />
					<Button variant='default' className='h-8 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm'>
						<Link href={'/login'}>{t('auth.login')}</Link>
					</Button>
					<Button variant='outline' className='h-8 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm'>
						<Link href={'/signup'}>{t('auth.signup')}</Link>
					</Button>
				</div>
			)}
		</div>
	);
}
