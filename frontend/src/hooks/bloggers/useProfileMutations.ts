import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

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
	const {t} = useTranslation();

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
			toast.success(t('profile.updateSuccess'));
			router.refresh();
		},
		onError(error) {
			console.error(error);
			toast.error(t('profile.updateError'));
		},
	});

	return mutation;
}
