import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string) {
	if (!dateString) return 'N/A';
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
}

export function getFileType(uri: string): string | 'image' | 'video' | 'unknown' {
	const extension = uri.split('.').pop()?.toLowerCase();
	if (!extension) return 'unknown';

	const imageTypes = ['jpg', 'jpeg', 'png'];
	const videoTypes = ['mp4', 'mov', 'avi'];
	if (imageTypes.includes(extension)) return 'image';
	if (videoTypes.includes(extension)) return 'video';

	return extension;
};