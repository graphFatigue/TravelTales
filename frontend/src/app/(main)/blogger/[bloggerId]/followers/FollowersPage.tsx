'use client';

import FollowPage from '@/components/follow/FollowPage';
import { useInfiniteFollowersBloggers } from '@/hooks/bloggers/useInfiniteBloggers';

export default function FollowersPage({ bloggerId }: { bloggerId: number }) {
	const responseData = useInfiniteFollowersBloggers(bloggerId);
	return <FollowPage followType='followers' responseData={responseData} />;
}
