'use client';

import { PostForm } from '@/components/Post/PostForm';
import { useSession } from 'next-auth/react';

export function CreatePostForm() {
	const { data: session } = useSession();

	if (!session) return <div>Unauthorized</div>;

	return <PostForm isEditing={false} />;
}
