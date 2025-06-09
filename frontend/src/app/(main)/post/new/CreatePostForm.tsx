import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { PostForm } from '@/components/post/PostForm';
import { getServerSession } from 'next-auth';

export async function CreatePostForm() {
	const session = await getServerSession(authOptions);

	if (!session) throw new Error('Unauthorized');

	return <PostForm isEditing={false} />;
}
