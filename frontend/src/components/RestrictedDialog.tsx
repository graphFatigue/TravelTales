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

export default function RestrictedDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Restricted</DialogTitle>
					<DialogDescription>
						You must be logged in to perform this action.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						className='bg-primary text-primary-foreground hover:bg-primary/90'
						onClick={() => redirect('/login')}
					>
						Login
					</Button>
					<Button
						className='bg-muted text-muted-foreground hover:bg-muted/90'
						onClick={() => redirect('/signup')}
					>
						Sign Up
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
