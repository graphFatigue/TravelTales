import 'cropperjs/dist/cropper.css';
import { useRef } from 'react';
import { Cropper, ReactCropperElement } from 'react-cropper';
import { Button } from './ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from './ui/dialog';
import { useTranslation } from 'react-i18next';

interface CropImageDialogProps {
	src: string;
	cropAspectRatio: number;
	onCropped: (blob: Blob | null) => void;
	onClose: () => void;
}

export default function CropImageDialog({
	src,
	cropAspectRatio,
	onCropped,
	onClose,
}: CropImageDialogProps) {
	const cropperRef = useRef<ReactCropperElement>(null);
	const { t } = useTranslation();

	function crop() {
		const cropper = cropperRef.current?.cropper;
		if (!cropper) return;
		cropper.getCroppedCanvas().toBlob(blob => onCropped(blob), 'image/webp');
		onClose();
	}

	return (
		<Dialog open onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t('dialog.cropImage.title')}</DialogTitle>
				</DialogHeader>
				<Cropper
					src={src}
					aspectRatio={cropAspectRatio}
					guides={false}
					zoomable={false}
					ref={cropperRef}
					className='mx-auto size-fit'
				/>
				<DialogFooter>
					<Button variant='secondary' onClick={onClose}>
						{t('dialog.cropImage.cancel')}
					</Button>
					<Button onClick={crop}>{t('dialog.cropImage.crop')}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
