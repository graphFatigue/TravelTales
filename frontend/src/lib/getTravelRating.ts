export default function getTravelerRating(citiesCount: number) {
	if (citiesCount >= 150)
		return {
			id: 5,
			title: 'World Explorer',
			range: '150+ cities',
			description:
				'This elite category includes travelers who have visited an exceptional number of cities. Their experiences often focus on comprehensive global travel, sharing expert-level insights and inspiring stories.',
		};
	if (citiesCount >= 71)
		return {
			id: 4,
			title: 'Global Voyager',
			range: '71–150 cities',
			description:
				'Representing a broad range of travel experiences, these travelers have explored many corners of the world. They typically highlight unique and less-traveled destinations, inspiring a wide audience.',
		};
	if (citiesCount >= 31)
		return {
			id: 3,
			title: 'Seasoned Traveler',
			range: '31–70 cities',
			description:
				'Travelers in this group are experienced with extensive knowledge of diverse destinations. They offer in-depth reviews, cultural insights, and specialized travel advice.',
		};
	if (citiesCount >= 11)
		return {
			id: 2,
			title: 'Adventurous Wanderer',
			range: '11–30 cities',
			description:
				'These travelers have explored a moderate number of cities, showcasing a growing passion for travel. Their experiences often include varied adventures, detailed itineraries, and travel hacks.',
		};
	return {
		id: 1,
		title: 'Beginner Explorer',
		range: '1–10 cities',
		description:
			'Travelers in this category have visited up to 10 cities. They are just starting their journey and usually share first impressions and beginner travel tips.',
	};
}
