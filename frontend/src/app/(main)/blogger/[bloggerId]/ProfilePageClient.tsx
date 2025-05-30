'use client';

import { Blogger } from '@/types/types';
import UserAvatar from '@/components/user/UserAvatar';
import { Separator } from '@/components/ui/separator';
import UserProfile from './Profile';
import EditProfileButton from './EditProfileButton';
import FollowButton from '@/components/follow/FollowButton';
import { useBlogger } from '@/hooks/bloggers/useBlogger';
import { Session } from 'next-auth';
import Link from 'next/link';
import { DeleteBloggerButton } from '@/components/bloggers/DeleteBloggerButton';
import { Star } from 'lucide-react';
import { useTravelerRating } from '@/hooks/useTravelRating';

interface ProfilePageClientProps {
	initialBlogger: Blogger;
	session: Session | null;
}

export default function ProfilePageClient({
	initialBlogger,
	session,
}: ProfilePageClientProps) {
	const { data: blogger } = useBlogger(initialBlogger.id, {
		initialData: initialBlogger,
	});

	const travelerRating = useTravelerRating(blogger?.visitedCities?.length || 0);

	if (!blogger) return null;

	return (
		<div className='container mx-auto max-w-5xl px-4 py-8'>
			<div className='flex flex-col items-center gap-8 md:flex-row'>
				<div className='flex flex-col items-center gap-4'>
					<UserAvatar size={180} avatarUrl={blogger.image} />
					{blogger.id === session?.user.blogger?.id ? (
						<EditProfileButton blogger={initialBlogger} />
					) : (
						<FollowButton
							bloggerId={blogger.id}
							isFollowing={blogger.isFollowing}
						/>
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
							<Link href={`/blogger/${blogger.id}/followers`}>
								<div className='text-sm text-muted-foreground hover:underline'>
									Followers
								</div>
							</Link>
						</div>
						<div className='text-center'>
							<div className='text-2xl font-bold'>{blogger.followingCount}</div>
							<Link href={`/blogger/${blogger.id}/following`}>
								<div className='text-sm text-muted-foreground hover:underline'>
									Followings
								</div>
							</Link>
						</div>
					</div>

					<div className='mb-4 flex items-center gap-2'>
						{/* {[...Array(travelerRating.id + 1)].map((_, index) => (
							<Star key={index} className='h-6 w-6 text-yellow-500' />
						))} */}
						<Star className='h-6 w-6 text-yellow-500' />
						<div>
							<h3 className='text-lg font-bold'>{travelerRating.title}</h3>
							<p className='text-sm text-muted-foreground'>
								{travelerRating.range}
							</p>
						</div>
					</div>
				</div>

				{(blogger.id === session?.user.blogger?.id ||
					session?.role === 'Admin') && (
					<DeleteBloggerButton bloggerId={blogger.id} />
				)}
			</div>

			<Separator className='my-6' />

			<UserProfile blogger={blogger} />
		</div>
	);
}
