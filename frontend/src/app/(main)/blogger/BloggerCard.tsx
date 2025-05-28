import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import UserAvatar from '@/components/user/UserAvatar';
import { Blogger } from '@/types/types';
import { Calendar, MapPin, UserPlus } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react';

export default function BloggerCard({ blogger }: { blogger: Blogger }) {
	return (
		<Card className='group transition-all duration-300 hover:shadow-lg'>
			<CardHeader className='relative pb-12'>
				<div className='absolute inset-0 rounded-t-lg bg-gradient-to-br from-primary/5 to-secondary/5' />

				<div className='relative z-10 -mt-16 flex justify-center'>
					<UserAvatar avatarUrl={blogger.image} size={120} />
				</div>
			</CardHeader>

			<CardContent className='pt-4'>
				<div className='text-center'>
					<CardTitle className='text-xl'>
						{blogger.firstName} {blogger.lastName}
					</CardTitle>
					{(blogger.city || blogger.country) && (
						<CardDescription className='mt-1 flex items-center justify-center gap-1'>
							<MapPin className='h-4 w-4' />
							{blogger.city?.name}
							{blogger.city && blogger.country && ', '}
							{blogger.country?.name}
						</CardDescription>
					)}
				</div>

				{blogger.bio && (
					<p className='mt-4 line-clamp-3 text-sm text-muted-foreground'>
						{blogger.bio}
					</p>
				)}
			</CardContent>

			<CardFooter className='flex items-center justify-between'>
				<div className='flex items-center gap-2 text-sm'>
					<div className='flex items-center gap-1'>
						<UserPlus className='h-4 w-4 text-primary' />
						<span className='font-medium'>{blogger.followerCount}</span>
					</div>
					<div className='flex items-center gap-1'>
						<Calendar className='h-4 w-4 text-primary' />
						<span>
							{new Date(blogger.createdAt).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'short',
							})}
						</span>
					</div>
				</div>
				<Button
					variant='outline'
					onClick={() => {
						redirect(`/blogger/${blogger.id}`);
					}}
				>
					See
				</Button>
			</CardFooter>
		</Card>
	);
}
