'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useFollowMutations } from '@/hooks/useFollowMutations';

interface FollowButtonProps {
  bloggerId: number;
  isFollowing: boolean;
}

export default function FollowButton({ bloggerId, isFollowing }: FollowButtonProps) {
  const { followMutation, unfollowMutation } = useFollowMutations(bloggerId);

  const handleFollow = () => {
    if (isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  const isLoading = followMutation.isPending || unfollowMutation.isPending;

  return (
		<Button
			variant='outline'
			onClick={handleFollow}
			disabled={isLoading}
			aria-label={isFollowing ? 'Unfollow' : 'Follow'}
		>
			{isLoading ? (
				<Loader2 className='h-4 w-4 animate-spin' />
			) : isFollowing ? (
				'Unfollow'
			) : (
				'Follow'
			)}
		</Button>
	);
}