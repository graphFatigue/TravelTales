import { BudgetLevel } from '@/types/types';
import { DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BudgetIndicatorProps {
	level: BudgetLevel;
	className?: string;
}

const budgetLevels = [
	{ text: '0 - 100', class: 'bg-green-100 text-green-800', color: 'green' },
	{ text: '100 - 500', class: 'bg-blue-100 text-blue-800', color: 'blue' },
	{
		text: '500 - 2000',
		class: 'bg-yellow-100 text-yellow-800',
		color: 'yellow',
	},
	{
		text: '2000 - 5000',
		class: 'bg-orange-100 text-orange-800',
		color: 'orange',
	},
	{ text: '5000+', class: 'bg-red-100 text-red-800', color: 'red' },
];

export function BudgetIndicator({
	level,
	className = '',
}: BudgetIndicatorProps) {
	const { t } = useTranslation();
	const budgetInfo = budgetLevels[level] || budgetLevels[0];

	return (
		<div
			className={`flex min-w-fit items-center rounded-full px-3 py-1 text-sm font-medium ${budgetInfo.class} ${className}`}
			title={t('post.budgetLevel', { level })}
		>
			<DollarSign className='mr-1 h-4 w-4' />
			{budgetInfo.text}
			{/* <div className='ml-2 flex space-x-1'>
				{Array.from({ length: 4 }).map((_, i) => (
					<span
						key={i}
						className={cn(
							'h-4 w-4 rounded-full',
							i < level ? 'bg-primary' : 'bg-muted',
						)}
					/>
				))}
			</div> */}
		</div>
	);
}
