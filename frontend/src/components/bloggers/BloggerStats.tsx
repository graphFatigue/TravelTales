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
		<TabsContent value='statistics' className='mt-6'>
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<BarChart2 className='h-5 w-5' />
						{t('stats.yourStatistics')}
					</CardTitle>
				</CardHeader>
				<CardContent className='grid gap-6'>
					{/* Stats Overview */}
					<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2'>
						<StatCard
							title={t('stats.totalLikes')}
							value={stats.totalLikes}
							icon={<Heart className='h-5 w-5 text-red-500' />}
							description={t('stats.allTimeLikes')}
						/>
						<StatCard
							title={t('stats.totalComments')}
							value={stats.totalComments}
							icon={<MessageCircle className='h-5 w-5 text-blue-500' />}
							description={t('stats.allTimeComments')}
						/>
					</div>

					{/* Most Popular Post */}
					<div className='mt-4'>
						<h3 className='mb-4 flex items-center gap-2 text-lg font-semibold'>
							<ArrowUp className='h-5 w-5 text-yellow-500' />
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
		<div className='rounded-lg border p-4'>
			<div className='flex items-center justify-between'>
				<h4 className='text-sm font-medium text-muted-foreground'>{title}</h4>
				{icon}
			</div>
			<div className='mt-2'>
				<p className='text-2xl font-bold'>{value}</p>
				<p className='mt-1 text-xs text-muted-foreground'>{description}</p>
			</div>
		</div>
	);
}
