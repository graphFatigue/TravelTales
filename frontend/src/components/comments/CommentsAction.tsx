'use client';
import { useState } from 'react';
import { CardFooter } from '../ui/card';
import { useSession } from 'next-auth/react';
import { Comment, UpdateComment } from '@/types/types';
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

interface CommentsActionProps {
	edit: (commentId: number, data: UpdateComment) => Promise<void>;
	remove: (commentId: number) => Promise<void>;
	comment: Comment;
}

export function CommentsAction({ edit, remove, comment }: CommentsActionProps) {
	const { data: session } = useSession();

	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [editingContent, setEditingContent] = useState('');
	const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
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
			setEditingContent('');
		}
	};

	return (
		<CardFooter className='flex justify-end gap-2 bg-muted/20 px-4 py-2'>
			{session?.user.blogger?.id === comment.bloggerId && (
				<Dialog
					open={isEditDialogOpen && editingCommentId === comment.id}
					onOpenChange={setIsEditDialogOpen}
				>
					<DialogTrigger asChild>
						<Button
							variant='ghost'
							size='sm'
							className='h-8 px-2 text-muted-foreground hover:text-foreground'
							onClick={() => handleEdit(comment.id, comment.content)}
						>
							<Edit2 className='mr-1 h-4 w-4' />
							<span className='text-xs'>Edit</span>
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Edit Comment</DialogTitle>
							<DialogDescription>
								Make changes to your comment below.
							</DialogDescription>
						</DialogHeader>
						<div className='py-4'>
							<Textarea
								value={editingContent}
								onChange={e => setEditingContent(e.target.value)}
								className='min-h-[100px]'
							/>
						</div>
						<DialogFooter>
							<Button
								variant='outline'
								onClick={() => setIsEditDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button onClick={submitEdit}>Save changes</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}

			{(session?.user.blogger?.id === comment.post?.blogger.id ||
				session?.user.blogger?.id === comment.bloggerId) && (
				<ConfirmationDialog
					title={'Delete Comment'}
					description={
						'Are you sure you want to delete this comment? This action cannot be undone.'
					}
					remove={() => remove(comment.id)}
				/>
			)}
		</CardFooter>
	);
}
