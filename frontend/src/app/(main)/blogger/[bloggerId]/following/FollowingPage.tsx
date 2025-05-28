'use client';

import FollowPage from '@/components/follow/FollowPage';
import { useInfiniteFollowingBloggers } from '@/hooks/bloggers/useInfiniteBloggers';

export default function FollowingPage({ bloggerId }: { bloggerId: number }) {
	const responseData = useInfiniteFollowingBloggers(bloggerId);
	return <FollowPage followType='following' responseData={responseData} />;
}
