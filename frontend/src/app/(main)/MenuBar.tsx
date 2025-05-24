import { Button } from '@/components/ui/button';
import { Bell, Home, UserRoundCheck, UserRoundPlus, Users } from 'lucide-react';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '../api/auth/[...nextauth]/authOptions';

interface MenuBarProps {
	className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {
	const session = await getServerSession(authOptions);
	return (
		<div className={className}>
			<Button
				variant='ghost'
				className='flex items-center justify-start gap-3'
				title='Home'
				asChild
			>
				<Link href='/'>
					<Home />
					<span className='hidden lg:inline'>Home</span>
				</Link>
			</Button>
			<Button
				variant='ghost'
				className='flex items-center justify-start gap-3'
				title='Bloggers'
				asChild
			>
				<Link href='/blogger'>
					<Users />
					<span className='hidden lg:inline'>Bloggers</span>
				</Link>
			</Button>

			{session?.user && (
				<>
					<Button
						variant='ghost'
						className='flex items-center justify-start gap-3'
						title='Followers'
						asChild
					>
						<Link href={`/blogger/${session?.user.blogger?.id}/followers`}>
							<UserRoundPlus />
							<span className='hidden lg:inline'>Followers</span>
						</Link>
					</Button>
					<Button
						variant='ghost'
						className='flex items-center justify-start gap-3'
						title='Following'
						asChild
					>
						<Link href={`/blogger/${session?.user.blogger?.id}/following`}>
							<UserRoundCheck />
							<span className='hidden lg:inline'>Following</span>
						</Link>
					</Button>
					<Button
						variant='ghost'
						className='flex items-center justify-start gap-3'
						title='Notifications'
						asChild
					>
						<Link href={`/`}>
							<Bell />
							<span className='hidden lg:inline'>Notifications</span>
						</Link>
					</Button>
				</>
			)}
		</div>
	);
}
