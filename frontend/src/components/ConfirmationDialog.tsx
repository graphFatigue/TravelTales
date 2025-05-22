import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';

interface ConfirmationDialogProps {
	title: string;
	description: string;
	remove: () => void;
}

export default function ConfirmationDialog({
	title,
	description,
	remove,
}: ConfirmationDialogProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant='ghost'
					size='sm'
					className='h-8 px-2 text-muted-foreground hover:text-destructive'
				>
					<Trash2 className='mr-1 h-4 w-4' />
					<span className='text-xs'>Delete</span>
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>
						{description}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
						onClick={remove}
					>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
