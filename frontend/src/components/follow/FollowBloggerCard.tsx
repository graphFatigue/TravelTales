import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import UserAvatar from '@/components/UserAvatar';
import { FollowBlogger } from '@/types/types';
import { redirect } from 'next/navigation';
import React from 'react';

export default function FollowBloggerCard({
	blogger,
	followStatus,
}: {
	blogger: FollowBlogger;
	followStatus: 'following' | 'followers';
}) {
	return (
		<Card className='group transition-all duration-300 hover:shadow-lg'>
			<CardHeader className='relative pb-10'>
				<div className='absolute inset-0 rounded-t-lg bg-gradient-to-br from-primary/5 to-secondary/5' />

				<div className='relative z-10 -mt-16 flex justify-center'>
					<UserAvatar
						avatarUrl={
							followStatus === 'following'
								? blogger.followingImage
								: blogger.followerImage
						}
						size={120}
					/>
				</div>
			</CardHeader>

			<CardContent >
				<CardTitle className='text-center text-xl'>
					{followStatus === 'following'
						? blogger.followingName
						: blogger.followerName}
				</CardTitle>
			</CardContent>

			<CardFooter className='flex justify-center'>
				<Button
					variant='outline'
					onClick={() => {
						redirect(
							`/blogger/${followStatus === 'following' ? blogger.followingId : blogger.followerId}`,
						);
					}}
				>
					See
				</Button>
			</CardFooter>
		</Card>
	);
}
