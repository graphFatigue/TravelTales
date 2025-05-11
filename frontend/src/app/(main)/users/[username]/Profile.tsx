'use client';

import { useState } from 'react';
import { CalendarIcon, MapPin, BookOpen, Star } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserAvatar from '@/components/UserAvatar';
import { useSession } from 'next-auth/react';

const userData = {
	fullName: 'Iryna Bibik',
	dateOfBirth: new Date('2004-05-21'),
	avatarUrl: '',
	gender: 'Female',
	countries: [
		'United States',
		'Japan',
		'France',
		'Italy',
		'Spain',
		'Germany',
		'United Kingdom',
	],
	cities: [
		'New York',
		'Tokyo',
		'Paris',
		'Rome',
		'Barcelona',
		'Berlin',
		'London',
		'San Francisco',
		'Los Angeles',
		'Chicago',
		'Miami',
		'Seattle',
		'Portland',
		'Austin',
		'Denver',
		'Boston',
		'Washington DC',
		'Philadelphia',
		'San Diego',
		'Nashville',
		'New Orleans',
		'Las Vegas',
		'Phoenix',
		'Atlanta',
		'Dallas',
		'Houston',
	],
	bio: 'Travel enthusiast and photographer with a passion for exploring urban landscapes and local cuisines. Always looking for the next adventure!',
	location: 'Poltava, Ukraine',
	followers: 1245,
	following: 567,
	posts: 89,
};

const getTravelerRating = (citiesCount: number) => {
	if (citiesCount >= 150)
		return {
			title: 'World Explorer',
			range: '150+ cities',
			description:
				'This elite category includes travelers who have visited an exceptional number of cities. Their experiences often focus on comprehensive global travel, sharing expert-level insights and inspiring stories.',
		};
	if (citiesCount >= 71)
		return {
			title: 'Global Voyager',
			range: '71–150 cities',
			description:
				'Representing a broad range of travel experiences, these travelers have explored many corners of the world. They typically highlight unique and less-traveled destinations, inspiring a wide audience.',
		};
	if (citiesCount >= 31)
		return {
			title: 'Seasoned Traveler',
			range: '31–70 cities',
			description:
				'Travelers in this group are experienced with extensive knowledge of diverse destinations. They offer in-depth reviews, cultural insights, and specialized travel advice.',
		};
	if (citiesCount >= 11)
		return {
			title: 'Adventurous Wanderer',
			range: '11–30 cities',
			description:
				'These travelers have explored a moderate number of cities, showcasing a growing passion for travel. Their experiences often include varied adventures, detailed itineraries, and travel hacks.',
		};
	return {
		title: 'Beginner Explorer',
		range: '1–10 cities',
		description:
			'Travelers in this category have visited up to 10 cities. They are just starting their journey and usually share first impressions and beginner travel tips.',
	};
};

export default function UserProfile() {
	const [activeTab, setActiveTab] = useState('overview');
	const travelerRating = getTravelerRating(userData.cities.length);
	const { data: session } = useSession();
	console.log(session);

	return (
		<div className="container mx-auto py-8 px-4 max-w-5xl">
			{/* Header Section */}
			<div className="flex flex-col md:flex-row gap-6 items-start">
				{/* Avatar */}
				<div className="flex flex-col items-center gap-2">
					<UserAvatar size={150} avatarUrl={userData?.avatarUrl} />
					<Button variant="outline" size="sm">
						Edit Profile
					</Button>
				</div>

				{/* User Info */}
				<div className="flex-1 space-y-4">
					<div>
						<h1 className="text-3xl font-bold">
							{userData.fullName}
						</h1>
						<div className="flex items-center gap-2 text-muted-foreground mt-1">
							<MapPin className="h-4 w-4" />
							<span>{userData.location}</span>
						</div>
					</div>

					{/* Stats */}
					<div className="flex gap-6">
						<div className="text-center">
							<div className="text-2xl font-bold">
								{userData.posts}
							</div>
							<div className="text-sm text-muted-foreground">
								Posts
							</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold">
								{userData.followers}
							</div>
							<div className="text-sm text-muted-foreground">
								Followers
							</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold">
								{userData.following}
							</div>
							<div className="text-sm text-muted-foreground">
								Following
							</div>
						</div>
					</div>

					{/* Traveler Rating */}
					<div className="flex items-center gap-2">
						<Star className="h-5 w-5 text-yellow-500" />
						<span className="font-semibold">
							{travelerRating.title}
						</span>
						<Badge variant="outline">{travelerRating.range}</Badge>
					</div>
				</div>
			</div>

			<Separator className="my-6" />

			{/* Tabs */}
			<Tabs
				defaultValue="overview"
				value={activeTab}
				onValueChange={setActiveTab}
				className="w-full"
			>
				<TabsList className="grid grid-cols-3 md:w-[400px]">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="places">Places</TabsTrigger>
					<TabsTrigger value="posts">Posts</TabsTrigger>
				</TabsList>

				{/* Overview Tab */}
				<TabsContent value="overview" className="space-y-6 mt-6">
					<Card>
						<CardHeader>
							<CardTitle>About</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<h3 className="text-sm font-medium text-muted-foreground">
										Full Name
									</h3>
									<p>{userData.fullName}</p>
								</div>
								<div>
									<h3 className="text-sm font-medium text-muted-foreground">
										Gender
									</h3>
									<p>{userData.gender}</p>
								</div>
								<div>
									<h3 className="text-sm font-medium text-muted-foreground">
										Date of Birth
									</h3>
									<div className="flex items-center">
										<CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
										<span>
											{format(
												userData.dateOfBirth,
												'MMMM d, yyyy'
											)}
										</span>
									</div>
								</div>
								<div>
									<h3 className="text-sm font-medium text-muted-foreground">
										Location
									</h3>
									<p>{userData.location}</p>
								</div>
							</div>

							<div>
								<h3 className="text-sm font-medium text-muted-foreground mb-2">
									Bio
								</h3>
								<p>{userData.bio}</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Traveler Rating</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center gap-2 mb-4">
								<Star className="h-6 w-6 text-yellow-500" />
								<div>
									<h3 className="font-bold text-lg">
										{travelerRating.title}
									</h3>
									<p className="text-sm text-muted-foreground">
										{travelerRating.range}
									</p>
								</div>
							</div>
							<p>{travelerRating.description}</p>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Places Tab */}
				<TabsContent value="places" className="space-y-6 mt-6">
					<Card>
						<CardHeader>
							<CardTitle>Countries Visited</CardTitle>
							<CardDescription>
								{userData.countries.length} countries in total
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-2">
								{userData.countries.map((country) => (
									<Badge key={country} variant="secondary">
										{country}
									</Badge>
								))}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Cities Explored</CardTitle>
							<CardDescription>
								{userData.cities.length} cities in total
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-2">
								{userData.cities.map((city) => (
									<Badge key={city} variant="outline">
										{city}
									</Badge>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Posts Tab */}
				<TabsContent value="posts" className="mt-6">
					<Card>
						<CardHeader>
							<CardTitle>Recent Posts</CardTitle>
							<CardDescription>
								View all {userData.posts} posts
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="text-center py-8">
									<BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
									<h3 className="mt-4 text-lg font-medium">
										No posts to display
									</h3>
									<p className="text-sm text-muted-foreground mt-2">
										Posts will appear here once created.
									</p>
									<Button className="mt-4">
										Create a Post
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
