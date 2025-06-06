import { Label } from '@/components/ui/label';
import { Blogger } from '@/types/types';
import AvatarInput from './AvatarInput';
import avatarPlaceholder from '@/assets/avatar-placeholder.png';
import { useTranslation } from 'react-i18next';

interface AvatarSectionProps {
	blogger: Blogger;
	croppedAvatar: Blob | null | undefined;
	onImageCropped: (blob: Blob | null) => void;
}

export function AvatarSection({
	blogger,
	croppedAvatar,
	onImageCropped,
}: AvatarSectionProps) {
	const { t } = useTranslation();
	return (
		<div className='space-y-1.5'>
			<Label>{t('profile.avatar')}</Label>
			<AvatarInput
				src={
					croppedAvatar
						? URL.createObjectURL(croppedAvatar)
						: blogger.image || avatarPlaceholder
				}
				onImageCropped={onImageCropped}
			/>
		</div>
	);
}
