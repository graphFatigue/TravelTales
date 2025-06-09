'use client';

import { PostForm } from '@/components/post/PostForm';
import PostLoader from '@/components/post/PostLoader';
import { usePost } from '@/hooks/posts/usePost';
import { useSession } from 'next-auth/react';
import { notFound, useParams } from 'next/navigation';

export function EditPostForm() {
	const { postId } = useParams();
	const { data: session } = useSession();
	const { data: post, isLoading, error } = usePost(Number(postId));

	if (isLoading) return <PostLoader />;
	if (!session || session.user.blogger?.id !== post?.bloggerId || error) throw new Error('Unauthorized');
	if (!post) return notFound();

	return <PostForm post={post} isEditing />;
}
