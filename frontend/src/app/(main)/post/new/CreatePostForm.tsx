import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { PostForm } from '@/components/post/PostForm';
import { getServerSession } from 'next-auth';

export async function CreatePostForm() {
	const session = await getServerSession(authOptions);

	if (!session) return <div>Unauthorized</div>;

	return <PostForm isEditing={false} />;
}
