'use client';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAssignRole, useDeleteUser, useRoles } from '@/hooks/users';
import UserAvatar from '@/components/user/UserAvatar';
import { User } from '@/types/types';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export function UserListItem({ user }: { user: User }) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { data: roles } = useRoles();
	const { mutate: deleteUser } = useDeleteUser();
	const { mutate: assignRole } = useAssignRole();
	const {t} = useTranslation();

	const handleDelete = () => {
		deleteUser(user.id, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['users'] });
			},
		});
	};

	const handleRoleAssign = (roleId: string) => {
		assignRole(
			{ userId: user.id, roleId },
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ['users'] });
					toast.success(t('admin.role.assignRoleSuccess'));
				},
				onError: error => {
					console.error('Failed to assign role:', error);
					toast.error(t('admin.role.assignRoleError', { message: error.message }));
				},
			},
		);
	};

	return (
		<div
			className='flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50'
			onClick={() => {
				if (user.blogger) {
					router.push(`/blogger/${user.blogger.id}`);
				}
			}}
		>
			<div className='flex items-center space-x-4'>
				<div className='flex-shrink-0'>
					<UserAvatar size={48} avatarUrl={user.blogger?.image} />
				</div>
				<div>
					<div className='font-medium text-gray-900'>
						{user.blogger?.firstName} {user.blogger?.lastName}
					</div>
					<div className='text-gray-500'>{user.email}</div>
				</div>
			</div>
			<div className='flex items-center space-x-2'>
				<p>{user.roleName}</p>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant='ghost'
							size='sm'
							onClick={e => e.stopPropagation()}
						>
							<MoreHorizontal className='h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						{roles?.map(role => (
							<DropdownMenuItem
								key={role.id}
								onClick={e => {
									e.stopPropagation();
									handleRoleAssign(role.id);
								}}
							>
								{t('admin.role.assign')} {role.name}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
				<Button
					variant='ghost'
					size='sm'
					onClick={e => {
						e.stopPropagation();
						handleDelete();
					}}
				>
					<Trash2 className='h-4 w-4 text-red-500' />
				</Button>
			</div>
		</div>
	);
}
