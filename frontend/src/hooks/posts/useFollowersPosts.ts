import api from "@/lib/api/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PostsResponse } from "./usePosts";
import { useSession } from "next-auth/react";

export const useInfiniteFollowingPosts = () => {
    const { data: session } = useSession();
	return useInfiniteQuery<PostsResponse>({
		queryKey: ['posts', 'followers', session?.user.blogger?.id],
		queryFn: async ({ pageParam = 1 }) => {
			const response = await api.get(`api/Posts/followed`, {
				params: {
					page: pageParam,
					pageSize: 2,
					sorts: '-createdAt',
				},
			});
			return response.data;
		},
		getNextPageParam: lastPage => {
			return lastPage.hasNext ? lastPage.currentPage + 1 : undefined;
		},
		initialPageParam: 1,
		enabled: !!session?.user.blogger?.id,
	});
};
