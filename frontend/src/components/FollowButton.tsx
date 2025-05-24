'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFollowMutations } from '@/hooks/bloggers/useFollowMutations';

interface FollowButtonProps {
	bloggerId: number;
	isFollowing: boolean;
	className?: string;
	size?: 'default' | 'sm' | 'lg' | 'icon';
	variant?:
		| 'default'
		| 'destructive'
		| 'outline'
		| 'secondary'
		| 'ghost'
		| 'link';
	onSuccess?: () => void;
}

export default function FollowButton({
	bloggerId,
	isFollowing,
	className,
	size = 'default',
	variant = isFollowing ? 'outline' : 'default',
	onSuccess,
}: FollowButtonProps) {
	const { followMutation, unfollowMutation } = useFollowMutations(bloggerId);

	const handleFollow = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (isFollowing) {
			unfollowMutation.mutate(undefined, {
				onSuccess: () => onSuccess?.(),
			});
		} else {
			followMutation.mutate(undefined, {
				onSuccess: () => onSuccess?.(),
			});
		}
	};

	const isLoading = followMutation.isPending || unfollowMutation.isPending;

	return (
		<Button
			variant={variant}
			size={size}
			onClick={handleFollow}
			disabled={isLoading}
			aria-label={isFollowing ? 'Unfollow' : 'Follow'}
			className={cn(
				'transition-all',
				isLoading && 'cursor-not-allowed',
				className,
			)}
		>
			{isLoading ? (
				<Loader2 className='h-4 w-4 animate-spin' />
			) : isFollowing ? (
				'Following'
			) : (
				'Follow'
			)}
		</Button>
	);
}
