import FollowersPage from './FollowersPage';

export default async function Page({
	params,
}: {
	params: Promise<{ bloggerId: string }>;
}) {
	const { bloggerId } = await params;

	return (
		<div className='container mx-auto px-4 py-8'>
			<FollowersPage bloggerId={Number(bloggerId)} />
		</div>
	);
}
