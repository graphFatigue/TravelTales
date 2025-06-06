'use client';

import { Button } from '@/components/ui/button';
import { Loader2, UserMinus, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFollowMutations } from '@/hooks/bloggers/useFollowMutations';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import RestrictedDialog from '../RestrictedDialog';
import { useTranslation } from 'react-i18next';

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
	const { data: session } = useSession();
	const [openRestricted, setOpenRestricted] = useState(false);
	const { t } = useTranslation();

	const handleFollow = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!session) {
			setOpenRestricted(true);
			return;
		}
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
		<>
			<Button
				variant={variant}
				size={size}
				onClick={handleFollow}
				disabled={isLoading}
				aria-label={isFollowing ? t('follow.unfollow') : t('follow.follow')}
				className={cn(
					'transition-all',
					isLoading && 'cursor-not-allowed',
					className,
				)}
			>
				{isLoading ? (
					<Loader2 className='h-4 w-4 animate-spin' />
				) : isFollowing ? (
					<>
						<UserMinus className='mr-2 h-4 w-4' />
						{t('follow.unfollow')}
					</>
				) : (
					<>
						<UserPlus className='mr-2 h-4 w-4' />
						{t('follow.follow')}
					</>
				)}
			</Button>
			{openRestricted && (
				<RestrictedDialog open={openRestricted} setOpen={setOpenRestricted} />
			)}
		</>
	);
}
