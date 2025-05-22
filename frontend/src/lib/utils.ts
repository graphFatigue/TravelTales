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

export const getFileType = (uri: string) => {
	const extension = uri.split('.').pop()?.toLowerCase();
	if (!extension) return 'unknown';

	const imageTypes = ['jpg', 'jpeg', 'png'];
	if (imageTypes.includes(extension)) return 'image';

	return extension;
};