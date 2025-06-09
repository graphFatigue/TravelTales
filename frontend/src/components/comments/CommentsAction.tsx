'use client';
import { useState } from 'react';
import { CardFooter } from '../ui/card';
import { useSession } from 'next-auth/react';
import { Comment, Post, UpdateComment } from '@/types/types';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Edit2 } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import ConfirmationDialog from '../ConfirmationDialog';
import { useTranslation } from 'react-i18next';

interface CommentsActionProps {
	edit: (commentId: number, data: UpdateComment) => Promise<void>;
	remove: (commentId: number) => Promise<void>;
	comment: Comment;
	changeCommentsAmount: React.Dispatch<React.SetStateAction<number>>;
	post: Post;
}

export function CommentsAction({
	edit,
	remove,
	comment,
	changeCommentsAmount,
	post,
}: CommentsActionProps) {
	const { data: session } = useSession();

	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [editingContent, setEditingContent] = useState(comment.content);
	const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
	const { t } = useTranslation();

	const handleEdit = (commentId: number, currentContent: string) => {
		setEditingCommentId(commentId);
		setEditingContent(currentContent);
		setIsEditDialogOpen(true);
	};

	const submitEdit = async () => {
		if (editingCommentId && editingContent.trim()) {
			await edit(editingCommentId, { content: editingContent });
			setIsEditDialogOpen(false);
			setEditingCommentId(null);
		}
	};

	return (
		<CardFooter className='flex justify-end gap-1.5 bg-muted/20 px-3 py-1.5 sm:gap-2 sm:px-4 sm:py-2'>
			{session?.user.blogger?.id === comment.bloggerId && (
				<Dialog
					open={isEditDialogOpen && editingCommentId === comment.id}
					onOpenChange={setIsEditDialogOpen}
				>
					<DialogTrigger asChild>
						<Button
							variant='ghost'
							className='h-7 px-1.5 text-xs text-muted-foreground hover:text-foreground sm:h-8 sm:px-2 sm:text-sm'
							onClick={() => handleEdit(comment.id, comment.content)}
						>
							<Edit2 className='mr-1 h-3 w-3 sm:h-4 sm:w-4' />
							{t('common.edit')}
						</Button>
					</DialogTrigger>
					<DialogContent className='sm:max-w-[425px]'>
						<DialogHeader>
							<DialogTitle className='text-base sm:text-lg'>
								{t('comments.edit')}
							</DialogTitle>
							<DialogDescription className='text-xs sm:text-sm'>
								{t('comments.makeChanges')}
							</DialogDescription>
						</DialogHeader>
						<div className='py-3 sm:py-4'>
							<Textarea
								value={editingContent}
								onChange={e => setEditingContent(e.target.value)}
								className='min-h-[80px] text-xs sm:min-h-[100px] sm:text-sm'
								maxLength={1000}
							/>
						</div>
						<DialogFooter className='gap-2'>
							<Button
								variant='outline'
								onClick={() => setIsEditDialogOpen(false)}
								className='h-8 text-xs sm:h-9 sm:text-sm'
							>
								{t('common.cancel')}
							</Button>
							<Button
								onClick={submitEdit}
								className='h-8 text-xs sm:h-9 sm:text-sm'
							>
								{t('common.save')}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}

			{(session?.user.blogger?.id === comment.bloggerId ||
				session?.role === 'Admin' ||
				post.bloggerId === session?.user.blogger?.id) && (
				<ConfirmationDialog
					title={t('comments.delete')}
					description={t('comments.deleteConfirm')}
					remove={() => {
						remove(comment.id);
						changeCommentsAmount(prev => prev - 1);
					}}
					className={'h-7 px-1.5 text-xs sm:h-8 sm:px-2 sm:text-sm'}
				/>
			)}
		</CardFooter>
	);
}
