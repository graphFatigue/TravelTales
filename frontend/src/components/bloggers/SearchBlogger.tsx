'use client';

import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function SearchBloggers({
	initialValue = '',
	onSearchChange,
}: {
	initialValue?: string;
	onSearchChange?: (searchTerm: string) => void;
}) {
	const [searchTerm, setSearchTerm] = useState(initialValue);
	const router = useRouter();
	const searchParams = useSearchParams();
	const { t } = useTranslation();

	useEffect(() => {
		const search = searchParams.get('s');
		if (search) {
			setSearchTerm(search);
			onSearchChange?.(search);
		}
	}, [searchParams, onSearchChange]);
	const handleSearch = () => {
		const params = new URLSearchParams();
		if (searchTerm) {
			params.set('s', searchTerm);
		} else {
			params.delete('s');
		}
		router.push(`?${params.toString()}`, { scroll: false });
		onSearchChange?.(searchTerm);
	};

	const handleClear = () => {
		setSearchTerm('');
		const params = new URLSearchParams();
		params.delete('s');
		router.push(`?${params.toString()}`, { scroll: false });
		onSearchChange?.('');
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};

	return (
		<div className='relative flex w-full max-w-md items-center space-x-2'>
			<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground' />
			<Input
				placeholder={t('bloggers.searchPlaceholder')}
				className='pl-10'
				value={searchTerm}
				onChange={e => setSearchTerm(e.target.value)}
				onKeyDown={handleKeyDown}
			/>
			{searchTerm && (
				<X
					className='h-4 w-4 cursor-pointer text-muted-foreground'
					onClick={handleClear}
				/>
			)}
			<Button onClick={handleSearch} type='button'>
				{t('users.search')}
			</Button>
		</div>
	);
}
