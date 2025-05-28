'use client';

import { useSession } from 'next-auth/react';
import UserButton from './UserButton';
import { Button } from '../ui/button';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { NotificationDropdown } from '../NotificationDropDown';

export default function UserButtons() {
	const { data: session } = useSession();
	const { t } = useTranslation();
	return (
		<div className='flex items-center gap-4'>
			<LanguageSwitcher />
			{session ? (
				<>
					<NotificationDropdown />
					<UserButton />
				</>
			) : (
				<div className='flex gap-4'>
					<Button variant='default'>
						<Link href={'/login'}>{t('auth.login')}</Link>
					</Button>
					<Button variant='outline'>
						<Link href={'/signup'}>{t('auth.signup')}</Link>
					</Button>
				</div>
			)}
		</div>
	);
}
