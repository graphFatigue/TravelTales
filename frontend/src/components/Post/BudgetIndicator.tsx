import { BudgetLevel } from '@/types/types';
import { DollarSign } from 'lucide-react';

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
	const budgetInfo = budgetLevels[level] || budgetLevels[0];

	return (
		<div
			className={`flex items-center rounded-full px-3 py-1 text-sm font-medium ${budgetInfo.class} ${className}`}
			title={`Budget level: ${level}`}
		>
			<DollarSign className='mr-1 h-4 w-4' />
			{budgetInfo.text}
			{/* <div className='ml-2 flex space-x-1'>
				{[0, 1, 2, 3, 4].map(lvl => (
					<div
						key={lvl}
						className={`h-2 w-2 rounded-full ${
							lvl <= level ? `bg-${budgetInfo.color}-500` : 'bg-gray-300'
						}`}
					/>
				))}
			</div> */}
		</div>
	);
}
