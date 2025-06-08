'use client';

import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function ViewButton({bloggerId}: {bloggerId: number}) {
	const { t } = useTranslation();
	return (
		<Button
			variant='outline'
			onClick={() => {
				redirect(`/blogger/${bloggerId}`);
			}}
		>
			{t('common.view')}
		</Button>
	);
}
