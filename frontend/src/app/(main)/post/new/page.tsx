import { CreatePostForm } from '@/app/(main)/post/new/CreatePostForm';

export default async function Page() {
	return (
		<div className='container mx-auto'>
			<CreatePostForm />
		</div>
	);
}
