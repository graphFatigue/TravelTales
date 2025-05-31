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

export default function UserProfile({ blogger }: { blogger: Blogger }) {
	const [activeTab, setActiveTab] = useState('overview');
	const travelerRating = useTravelerRating(blogger.visitedCities?.length || 0);

	return (
		<div className='container mx-auto max-w-5xl px-4 py-8'>
			{/* Tabs */}
			<Tabs
				defaultValue='overview'
				value={activeTab}
				onValueChange={setActiveTab}
				className='w-full'
			>
				<TabsList className='grid grid-cols-4 md:w-[400px]'>
					<TabsTrigger value='overview'>Overview</TabsTrigger>
					<TabsTrigger value='places'>Places</TabsTrigger>
					<TabsTrigger value='posts'>Posts</TabsTrigger>
					<TabsTrigger value='statistics'>Statistics</TabsTrigger>
				</TabsList>

				{/* Overview Tab */}
				<TabsContent value='overview' className='mt-6 space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle>About</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
								<div>
									<h3 className='text-sm font-medium text-muted-foreground'>
										Full Name
									</h3>
									<p>{`${blogger.firstName} ${blogger.lastName}`}</p>
								</div>
								<div>
									<h3 className='text-sm font-medium text-muted-foreground'>
										Gender
									</h3>
									<p>
										{blogger.sex === 1
											? 'Female'
											: blogger.sex === 2
												? 'Other'
												: 'Male'}
									</p>
								</div>
								<div>
									<h3 className='text-sm font-medium text-muted-foreground'>
										Date of Birth
									</h3>
									<div className='flex items-center'>
										<CalendarIcon className='mr-2 h-4 w-4 opacity-70' />
										<span>{format(blogger.birthDate, 'MMMM d, yyyy')}</span>
									</div>
								</div>
								<div>
									<h3 className='text-sm font-medium text-muted-foreground'>
										Location
									</h3>
									<p>
										{/* {loading
											? 'Loading...'
											: `${cities?.find(c => c.id === blogger.cityId)?.name}, ${countries?.find(c => c.id === blogger.countryId)?.name}`} */}

										{blogger.city
											? `${blogger.city?.name}, ${blogger.country?.name}`
											: 'No data'}
									</p>
								</div>
							</div>

							<div>
								<h3 className='mb-2 text-sm font-medium text-muted-foreground'>
									Bio
								</h3>
								<p>{blogger.bio}</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Traveler Rating</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='mb-4 flex items-center gap-2'>
								<Star className='h-6 w-6 text-yellow-500' />
								<div>
									<h3 className='text-lg font-bold'>{travelerRating.title}</h3>
									<p className='text-sm text-muted-foreground'>
										{travelerRating.range}
									</p>
								</div>
							</div>
							<p>{travelerRating.description}</p>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Places Tab */}
				<TabsContent value='places' className='mt-6 space-y-6'>
					<Card>
						<CardHeader>
							<CardTitle>Countries Visited</CardTitle>
							<CardDescription>
								{blogger.visitedCountries?.length || 0} countries in total
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
							<CardTitle>Cities Explored</CardTitle>
							<CardDescription>
								{blogger.visitedCities?.length || 0} cities in total
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

				{/* Posts Tab */}
				<TabsContent value='posts' className='mt-6'>
					<Card>
						<CardHeader>
							<CardTitle>Recent Posts</CardTitle>
							<CardDescription>
								View all {blogger.posts?.length || 0} posts
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
											No posts to display
										</h3>
										<p className='mt-2 text-sm text-muted-foreground'>
											Posts will appear here once created.
										</p>
										<Button className='mt-4'>Create a Post</Button>
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* Statistics Tab*/}
				<TabsContent value='statistics' className='mt-6'>
					<Card>
						<CardHeader>
							<CardTitle>Statistic</CardTitle>
						</CardHeader>
						<CardContent>
							<p> *Statistics* </p>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
