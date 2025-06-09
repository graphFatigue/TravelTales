'use client';

import { useState } from 'react';
import { CalendarIcon, BookOpen, Star } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Blogger } from '@/types/types';
import BloggersPosts from '@/components/bloggers/BloggersPosts';
import { useTravelerRating } from '@/hooks/useTravelRating';
import { redirect } from 'next/navigation';
import { StatisticsTab } from '@/components/bloggers/BloggerStats';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import { enUS, uk } from 'date-fns/locale';

export default function UserProfile({ blogger }: { blogger: Blogger }) {
	const [activeTab, setActiveTab] = useState('overview');
	const travelerRating = useTravelerRating(blogger.visitedCities?.length || 0);
	const { data: session } = useSession();
	const { t, i18n } = useTranslation();

	const dateLocale = i18n.language === 'uk' ? uk : enUS;

	return (
		<div className='container mx-auto max-w-5xl px-4 py-8'>
			<Tabs
				defaultValue='overview'
				value={activeTab}
				onValueChange={setActiveTab}
				className='w-full'
			>
				<TabsList className='grid grid-cols-4 md:w-[400px]'>
					<TabsTrigger value='overview'>{t('profile.overview')}</TabsTrigger>
					<TabsTrigger value='places'>{t('profile.places.title')}</TabsTrigger>
					<TabsTrigger value='posts'>{t('profile.posts.title')}</TabsTrigger>
					<TabsTrigger value='statistics'>
						{t('profile.statistics')}
					</TabsTrigger>
				</TabsList>

				<TabsContent value='overview' className='mt-6 space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle>{t('profile.about.title')}</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
								<div>
									<h3 className='text-sm font-medium text-muted-foreground'>
										{t('profile.about.fullName')}
									</h3>
									<p>{`${blogger.firstName} ${blogger.lastName}`}</p>
								</div>
								<div>
									<h3 className='text-sm font-medium text-muted-foreground'>
										{t('profile.about.gender.title')}
									</h3>
									<p>
										{blogger.sex === 1
											? t('profile.about.gender.female')
											: blogger.sex === 2
												? t('profile.about.gender.other')
												: t('profile.about.gender.male')}
									</p>
								</div>
								<div>
									<h3 className='text-sm font-medium text-muted-foreground'>
										{t('profile.about.birthDate')}
									</h3>
									<div className='flex items-center'>
										<CalendarIcon className='mr-2 h-4 w-4 opacity-70' />
										<span>
											{format(blogger.birthDate, 'PPP', { locale: dateLocale })}
										</span>
									</div>
								</div>
								<div>
									<h3 className='text-sm font-medium text-muted-foreground'>
										{t('profile.about.location')}
									</h3>
									<p>
										{blogger.city
											? `${blogger.city?.name}, ${blogger.country?.name}`
											: t('profile.about.noData')}
									</p>
								</div>
							</div>

							<div>
								<h3 className='mb-2 text-sm font-medium text-muted-foreground'>
									{t('profile.about.bio')}
								</h3>
								<p>{blogger.bio}</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>{t('profile.travelerRating.title')}</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='mb-4 flex items-center gap-2'>
								<Star className='h-6 w-6 text-yellow-500' />
								<div>
									<h3 className='text-lg font-bold'>
										{t(
											`profile.travelerRating.levels.${travelerRating.id}.title`,
										)}
									</h3>
									<p className='text-sm text-muted-foreground'>
										{t(
											`profile.travelerRating.levels.${travelerRating.id}.range`,
										)}
									</p>
								</div>
							</div>
							<p>
								{t(
									`profile.travelerRating.levels.${travelerRating.id}.description`,
								)}
							</p>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='places' className='mt-6 space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle>{t('profile.places.countriesVisited')}</CardTitle>
							<CardDescription>
								{t('profile.places.totalCountries', {
									count: blogger.visitedCountries?.length || 0,
								})}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='flex flex-wrap gap-2'>
								{blogger.visitedCountries?.map(country => (
									<Badge key={country.id} variant='secondary'>
										{country.name}
									</Badge>
								))}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>{t('profile.places.citiesExplored')}</CardTitle>
							<CardDescription>
								{t('profile.places.totalCities', {
									count: blogger.visitedCities?.length || 0,
								})}
							</CardDescription>
						</CardHeader>
						<CardContent>
							{blogger.visitedCountries?.length && (
								<div className='flex flex-wrap gap-2'>
									{blogger.visitedCities?.map(city => (
										<Badge key={city.id} variant='outline'>
											{city.name}
										</Badge>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='posts' className='mt-6'>
					<Card>
						<CardHeader>
							<CardTitle>{t('profile.posts.recentPosts')}</CardTitle>
							<CardDescription>
								{t('profile.posts.viewAll', {
									count: blogger.posts?.length || 0,
								})}
							</CardDescription>
						</CardHeader>
						<CardContent>
							{blogger.posts?.length ? (
								<BloggersPosts bloggerId={blogger.id} />
							) : (
								<div className='space-y-4'>
									<div className='py-8 text-center'>
										<BookOpen className='mx-auto h-12 w-12 text-muted-foreground opacity-50' />
										<h3 className='mt-4 text-lg font-medium'>
											{t('profile.posts.noPosts')}
										</h3>
										{session?.user.blogger?.id === blogger.id && (
											<Button
												className='mt-4'
												onClick={() => redirect('/post/new')}
											>
												{t('profile.posts.createPost')}
											</Button>
										)}
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<StatisticsTab bloggerId={blogger.id} />
			</Tabs>
		</div>
	);
}
