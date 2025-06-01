'use client';

import { PostForm } from '@/components/post/PostForm';
import PostLoader from '@/components/post/PostLoader';
import { usePost } from '@/hooks/posts/usePost';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';

export function EditPostForm() {
	const { postId } = useParams();
	const { data: session } = useSession();
	const { data: post, isLoading, error } = usePost(Number(postId));

	if (isLoading) return <PostLoader />;
	if (!session || session.user.blogger?.id !== post?.bloggerId)
		return <div>Unauthorized</div>;
	if (error) return <div>Error loading post</div>;
	if (!post) return <div>Post not found</div>;

	return <PostForm post={post} isEditing />;
}
