'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Blogger } from '@/types/types';
import EditBloggerProfileDialog from './EditProfileDIalog';
import { useLocationInfo } from '@/hooks/useLocationInfo';
import { useTranslation } from 'react-i18next';

interface EditProfileButtonProps {
	blogger: Blogger;
}

export default function EditProfileButton({ blogger }: EditProfileButtonProps) {
	const [showDialog, setShowDialog] = useState(false);
	useLocationInfo(blogger.countryId);
	const { t } = useTranslation();

	return (
		<>
			<Button variant='outline' onClick={() => setShowDialog(true)}>
				{t('profile.edit')}
			</Button>
			<EditBloggerProfileDialog
				blogger={blogger}
				open={showDialog}
				onOpenChange={setShowDialog}
			/>
		</>
	);
}
