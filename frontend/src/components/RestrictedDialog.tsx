import { redirect } from 'next/navigation';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';

export default function RestrictedDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
	const { t } = useTranslation();
	
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t('dialog.restricted.title')}</DialogTitle>
					<DialogDescription>
						{t('dialog.restricted.description')}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						className='bg-primary text-primary-foreground hover:bg-primary/90'
						onClick={() => redirect('/login')}
					>
						{t('auth.login')}
					</Button>
					<Button
						className='bg-muted text-muted-foreground hover:bg-muted/90'
						onClick={() => redirect('/signup')}
					>
						{t('auth.signup')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
