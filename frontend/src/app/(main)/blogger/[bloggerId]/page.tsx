import React, { cache } from 'react';
import { notFound } from 'next/navigation';
import api from '@/lib/api/api';
import UserAvatar from '@/components/UserAvatar';
import { Blogger } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import UserProfile from './Profile';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface PageProps {
	params: {
		bloggerId: string;
	};
}

const getBlogger = cache(async (bloggerId: string) => {
	const { data: blogger } = await api.get(`/api/Blogger/${bloggerId}`);

	if (!blogger) notFound();

	return blogger;
});

export default async function Page({ params }: PageProps) {
	const bloggerId = params.bloggerId;
	const blogger: Blogger = await getBlogger(bloggerId);

	const session = await getServerSession(authOptions);

	return (
		<div className='container mx-auto max-w-5xl px-4 py-8'>
			<div className='flex flex-col items-start gap-6 md:flex-row'>
				<div className='flex flex-col items-center gap-2'>
					<UserAvatar size={150} avatarUrl={blogger.image} />
					{blogger.id === session?.user.blogger?.id ? (
						<Button variant='outline' size='sm'>
							Edit Profile
						</Button>
					) : (
						<Button variant='outline' size='sm'>
							{blogger.isFollowing ? 'Unfollow' : 'Follow'}
						</Button>
					)}
				</div>

				{/* User Info */}
				<div className='flex-1 space-y-4'>
					<div>
						<h1 className='text-3xl font-bold'>
							{`${blogger.firstName} ${blogger.lastName}`}
						</h1>
					</div>

					{/* Stats */}
					<div className='flex gap-6'>
						<div className='text-center'>
							<div className='text-2xl font-bold'>
								{blogger.posts?.length || 0}
							</div>
							<div className='text-sm text-muted-foreground'>Posts</div>
						</div>
						<div className='text-center'>
							<div className='text-2xl font-bold'>{blogger.followerCount}</div>
							<div className='text-sm text-muted-foreground'>Followers</div>
						</div>
						<div className='text-center'>
							<div className='text-2xl font-bold'>{blogger.followingCount}</div>
							<div className='text-sm text-muted-foreground'>Following</div>
						</div>
					</div>

					{/* Traveler Rating */}
					{/* <div className="flex items-center gap-2">
								<Star className="h-5 w-5 text-yellow-500" />
								<span className="font-semibold">
									{travelerRating.title}
								</span>
								<Badge variant="outline">{travelerRating.range}</Badge>
							</div> */}
				</div>
			</div>

			<Separator className='my-6' />

			<UserProfile blogger={blogger} />
		</div>
	);
}
