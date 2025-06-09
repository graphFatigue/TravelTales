'use client';

import FollowPage from '@/components/follow/FollowPage';
import { useInfiniteFollowingBloggers } from '@/hooks/bloggers/useInfiniteBloggers';
import { useTranslation } from 'react-i18next';

export default function FollowingPage({ bloggerId }: { bloggerId: number }) {
	const responseData = useInfiniteFollowingBloggers(bloggerId);
	const { t } = useTranslation();
	return (
		<>
			<div className='mb-8 text-center'>
				<h1 className='text-4xl font-bold tracking-tight'>
					{t('dashboard.following')}
				</h1>
				<FollowPage followType='following' responseData={responseData} />
			</div>
		</>
	);
}
