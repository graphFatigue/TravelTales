'use client';

import { Blogger } from '@/types/types';
import UserAvatar from '@/components/UserAvatar';
import { Separator } from '@/components/ui/separator';
import UserProfile from './Profile';
import EditProfileButton from './EditProfileButton';
import FollowButton from '@/components/FollowButton';
import { useBlogger } from '@/hooks/useBlogger';
import { Session } from 'next-auth';

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

	if (!blogger) return null;

	return (
		<div className='container mx-auto max-w-5xl px-4 py-8'>
			<div className='flex flex-col items-start gap-6 md:flex-row'>
				<div className='flex flex-col items-center gap-2'>
					<UserAvatar size={150} avatarUrl={blogger.image} />
					{blogger.id === session?.user.blogger?.id ? (
						<EditProfileButton blogger={blogger} />
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
							<div className='text-sm text-muted-foreground'>Followers</div>
						</div>
						<div className='text-center'>
							<div className='text-2xl font-bold'>{blogger.followingCount}</div>
							<div className='text-sm text-muted-foreground'>Following</div>
						</div>
					</div>
				</div>
			</div>

			<Separator className='my-6' />

			<UserProfile blogger={blogger} />
		</div>
	);
}
