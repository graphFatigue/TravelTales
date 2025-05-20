import api from "@/lib/api/api";
import { notFound } from "next/navigation";
import { cache } from "react";
import { PostCard } from "./PostCard";

const getPost = cache(async (postId: string) => {
	const { data: post } = await api.get(`/api/Posts/${postId}`);

	if (!post) notFound();

	return post;
});

export default async function Page({ params }: { params: Promise<{ postId: string }> }) {
    const { postId } = await params;
    const post = await getPost(postId);
    return <div>
        <PostCard post={post} />
    </div>;
}
