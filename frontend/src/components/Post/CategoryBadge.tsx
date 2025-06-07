'use client';

import { Badge } from '@/components/ui/badge';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Category } from '@/types/types';

interface CategoryBadgeProps {
	category: Category;
	language?: 'en' | 'ua' | string;
	variant?: 'default' | 'secondary' | 'outline' | 'destructive';
	className?: string;
	onClick?: () => void;
	selected?: boolean;
}

export function CategoryBadge({
	category,
	language = 'en',
	variant = 'secondary',
	className = '',
	onClick,
	selected = false,
}: CategoryBadgeProps) {
	const displayName = language === 'en' ? category.name : category.nameUa;
	const displayDescription =
		language === 'en' ? category.description : category.descriptionUa;

	return (
		<TooltipProvider delayDuration={200}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Badge
						variant={selected ? 'default' : variant}
						className={`${className} ${
							onClick ? 'cursor-pointer' : ''
						} transition-colors`}
						onClick={onClick}
					>
						{displayName}
					</Badge>
				</TooltipTrigger>
				<TooltipContent side='bottom' className='max-w-[300px]'>
					<p>{displayDescription}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
