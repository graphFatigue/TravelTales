'use client';

import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useState } from 'react';
import RestrictedDialog from '../RestrictedDialog';
import { useSession } from 'next-auth/react';

export function CreatePostButton() {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const { data: session } = useSession();
	return (
		<>
			<Button
				onClick={() => {
					if (!session) {
						setOpen(true);
					}
				}}
			>
				<Link href={session ? '/post/create' : '/login'}>
					{t('post.create')}
				</Link>
			</Button>
			{open && <RestrictedDialog open={open} setOpen={setOpen} />}
		</>
	);
}
