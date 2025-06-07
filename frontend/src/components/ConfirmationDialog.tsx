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
import { useTranslation } from 'react-i18next';

interface ConfirmationDialogProps {
	title: string;
	description: string;
	remove: () => void;
	className?: string;
}

export default function ConfirmationDialog({
	title,
	description,
	remove,
	className,
}: ConfirmationDialogProps) {
	const { t } = useTranslation();
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant='ghost'
					className={
						className
							? className
							: 'h-8 px-2 text-muted-foreground hover:text-destructive'
					}
				>
					{!className && <Trash2 className='mr-1 h-4 w-4' />}
					{t('common.delete')}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
					<AlertDialogAction
						className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
						onClick={remove}
					>
						{t('coommon.delete')}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
