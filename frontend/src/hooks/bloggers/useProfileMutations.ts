// hooks/useProfileMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export interface UpdateBloggerProfileValues {
	firstName: string;
	lastName: string;
	birthDate?: string;
	sex: number;
	bio?: string;
	countryId?: number;
	cityId?: number;
}

export function useProfileMutations(bloggerId: number) {
	const queryClient = useQueryClient();
	const router = useRouter();

	const mutation = useMutation({
		mutationFn: async ({
			values,
			blob,
		}: {
			values: UpdateBloggerProfileValues;
			blob: Blob | null | undefined;
		}) => {
			await api.put(`/api/Blogger/${bloggerId}`, values);

			if (blob !== undefined) {
				if (blob === null) {
					await api.put(`/api/Blogger/${bloggerId}/image`, {
						base64Image: null,
						removeExisting: true,
					});
				} else {
					const base64Image = await new Promise<string>((resolve, reject) => {
						const reader = new FileReader();
						reader.readAsDataURL(blob);
						reader.onload = () => resolve(reader.result as string);
						reader.onerror = error => reject(error);
					});

					await api.put(`/api/Blogger/${bloggerId}/image`, {
						base64Image,
						removeExisting: true,
					});
				}
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['blogger', bloggerId] });
			router.refresh();
		},
		onError(error) {
			console.error(error);
			toast.error('Failed to update profile. Please try again.');
		},
	});

	return mutation;
}
