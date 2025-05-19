import { Button } from '@/components/ui/button';
import { Bell, Home, ChartLine} from 'lucide-react';
import Link from 'next/link';

interface MenuBarProps {
	className?: string;
}

export default function MenuBar({ className }: MenuBarProps) {
	return (
		<div className={className}>
			<Button
				variant="ghost"
				className="flex items-center justify-start gap-3"
				title="Home"
				asChild
			>
				<Link href="/">
					<Home />
					<span className="hidden lg:inline">Home</span>
				</Link>
			</Button>
			<Button
				variant="ghost"
				className="flex items-center justify-start gap-3"
				title="Notifications"
				asChild
			>
				<Link href={`/`}>
					<ChartLine />
					<span className="hidden lg:inline">Statistics</span>
				</Link>
			</Button>
			<Button
				variant="ghost"
				className="flex items-center justify-start gap-3"
				title="Notifications"
				asChild
			>
				<Link href={`/`}>
					<Bell />
					<span className="hidden lg:inline">Notifications</span>
				</Link>
			</Button>
		</div>
	);
}
