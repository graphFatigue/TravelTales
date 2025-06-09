'use client';

import FollowPage from '@/components/follow/FollowPage';
import { useInfiniteFollowersBloggers } from '@/hooks/bloggers/useInfiniteBloggers';
import { useTranslation } from 'react-i18next';

export default function FollowersPage({ bloggerId }: { bloggerId: number }) {
	const responseData = useInfiniteFollowersBloggers(bloggerId);
	const {t} = useTranslation();
	return (
		<>
			<div className='mb-8 text-center'>
				<h1 className='text-4xl font-bold tracking-tight'>
					{t('dashboard.followers')}
				</h1>
				<FollowPage followType='followers' responseData={responseData} />
			</div>
		</>
	);
}
