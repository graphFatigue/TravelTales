import FollowingPage from './FollowingPage';

export default async function Page({
	params,
}: {
	params: Promise<{ bloggerId: string }>;
}) {
	const { bloggerId } = await params;
	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='mb-8 text-center'>
				<h1 className='text-4xl font-bold tracking-tight'>Followings</h1>
			</div>
			<FollowingPage bloggerId={Number(bloggerId)} />
		</div>
	);
}
