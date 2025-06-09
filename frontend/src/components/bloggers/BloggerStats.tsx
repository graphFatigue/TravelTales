import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { PostCardPreview } from '@/components/post/PostCardPreview';
import {
	Heart,
	MessageCircle,
	BarChart2,
	ArrowUp,
} from 'lucide-react';
import { useBloggerStats } from '@/hooks/bloggers/useBloggerStat';
import { useTranslation } from 'react-i18next';

export function StatisticsTab({ bloggerId }: { bloggerId: number }) {
	const { t } = useTranslation();
	const { data: stats, isLoading } = useBloggerStats(bloggerId);

	if (isLoading) {
		return (
			<TabsContent value='statistics' className='mt-6'>
				<Card>
					<CardHeader>
						<CardTitle>{t('stats.loading')}</CardTitle>
					</CardHeader>
					<CardContent className='grid gap-4'>
						<div className='flex flex-wrap gap-4'>
							{[...Array(3)].map((_, i) => (
								<div
									key={i}
									className='h-24 w-full min-w-[200px] flex-1 animate-pulse rounded-md bg-muted'
								/>
							))}
						</div>
					</CardContent>
				</Card>
			</TabsContent>
		);
	}

	if (!stats) return null;

	return (
		<TabsContent value='statistics' className='mt-4 sm:mt-6'>
			<Card>
				<CardHeader className='p-4 sm:p-6'>
					<CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
						<BarChart2 className='h-4 w-4 sm:h-5 sm:w-5' />
						{t('stats.yourStatistics')}
					</CardTitle>
				</CardHeader>
				<CardContent className='grid gap-4 p-4 sm:gap-6 sm:p-6'>
					<div className='grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-2'>
						<StatCard
							title={t('stats.totalLikes')}
							value={stats.totalLikes}
							icon={<Heart className='h-4 w-4 sm:h-5 sm:w-5 text-red-500' />}
							description={t('stats.allTimeLikes')}
						/>
						<StatCard
							title={t('stats.totalComments')}
							value={stats.totalComments}
							icon={<MessageCircle className='h-4 w-4 sm:h-5 sm:w-5 text-blue-500' />}
							description={t('stats.allTimeComments')}
						/>
					</div>

					<div className='mt-2 sm:mt-4'>
						<h3 className='mb-3 sm:mb-4 flex items-center gap-2 text-base sm:text-lg font-semibold'>
							<ArrowUp className='h-4 w-4 sm:h-5 sm:w-5 text-yellow-500' />
							{t('stats.mostPopularPost')}
						</h3>
						{stats.mostPopularPost && (
							<PostCardPreview post={stats.mostPopularPost} />
						)}
					</div>
				</CardContent>
			</Card>
		</TabsContent>
	);
}

interface StatCardProps {
	title: string;
	value: string | number;
	icon: React.ReactNode;
	description: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
	return (
		<div className='rounded-lg border p-3 sm:p-4'>
			<div className='flex items-center justify-between'>
				<h4 className='text-xs sm:text-sm font-medium text-muted-foreground'>{title}</h4>
				{icon}
			</div>
			<div className='mt-1.5 sm:mt-2'>
				<p className='text-xl sm:text-2xl font-bold'>{value}</p>
				<p className='mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-muted-foreground'>{description}</p>
			</div>
		</div>
	);
}
