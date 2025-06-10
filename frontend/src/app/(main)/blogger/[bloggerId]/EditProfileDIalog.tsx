import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Blogger } from '@/types/types';
import { useProfileMutations } from '@/hooks/bloggers/useProfileMutations';
import {
	getProfileFormSchema,
	UpdateBloggerProfileValues,
} from '@/lib/validation';
import { AvatarSection } from '@/components/editProfile/AvatarSection';
import { BasicInfoSection } from '@/components/editProfile/BasicInfoSection';
import { BirthDateField } from '@/components/editProfile/BirthDateField';
import { GenderField } from '@/components/editProfile/GenderField';
import { BioField } from '@/components/editProfile/BioField';
import { LocationSection } from '@/components/editProfile/LocationSection';
import { useTranslation } from 'react-i18next';

interface EditBloggerProfileDialogProps {
	blogger: Blogger;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function EditBloggerProfileDialog({
	blogger,
	open,
	onOpenChange,
}: EditBloggerProfileDialogProps) {
	const [croppedAvatar, setCroppedAvatar] = useState<Blob | null | undefined>(
		undefined,
	);

	const { t } = useTranslation();
	const mutation = useProfileMutations(blogger.id);

	const form = useForm<UpdateBloggerProfileValues>({
		resolver: zodResolver(getProfileFormSchema(t)),
		defaultValues: {
			firstName: blogger.firstName,
			lastName: blogger.lastName,
			birthDate: blogger.birthDate || undefined,
			sex: blogger.sex,
			bio: blogger.bio || '',
			countryId: blogger.countryId || undefined,
			cityId: blogger.cityId || undefined,
			visitedCityIds: blogger?.visitedCountries?.map(c => c.id) || [],
			visitedCountryIds: blogger?.visitedCountries?.map(c => c.id) || [],
		},
	});

	const { watch } = form;
	const selectedCountryId = watch('countryId');

	useEffect(() => {
		const subscription = watch((value, { name }) => {
			if (name === 'birthDate') {
				console.log('Birth date changed:', value.birthDate);
			}
		});
		return () => subscription.unsubscribe();
	}, [watch]);

	async function onSubmit(values: UpdateBloggerProfileValues) {
		try {
			await mutation.mutateAsync(
				{
					values,
					blob: croppedAvatar,
				},
				{
					onSuccess: () => {
						setCroppedAvatar(undefined);
						onOpenChange(false);
					},
				},
			);
		} catch (error) {
			console.error('Failed to update profile:', error);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-h-[95vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>{t('profile.edit')}</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<AvatarSection
							blogger={blogger}
							croppedAvatar={croppedAvatar}
							onImageCropped={setCroppedAvatar}
						/>

						<BasicInfoSection control={form.control} />
						<BirthDateField control={form.control} />
						<GenderField control={form.control} />
						<BioField control={form.control} />

						<LocationSection
							control={form.control}
							selectedCountryId={selectedCountryId}
							setValue={form.setValue}
							visitedCountries={blogger.visitedCountries || []}
							visitedCities={blogger.visitedCities || []}
						/>

						<DialogFooter>
							<Button
								type='button'
								variant='outline'
								onClick={() => onOpenChange(false)}
							>
								{t('common.cancel')}
							</Button>
							<Button type='submit' disabled={mutation.isPending}>
								{mutation.isPending ? t('post.saving') : t('post.save')}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
