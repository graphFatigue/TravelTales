'use client';

import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export function CreatePostButton() {
	const { t } = useTranslation();
	return (
		<Link href='/post/new'>
			<Button>{t('post.create')}</Button>
		</Link>
	);
}
