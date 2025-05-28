'use client';

import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchBloggers({
	onSearch,
	initialValue = '',
}: {
	onSearch: (searchTerm: string) => void;
	initialValue?: string;
}) {
	const [searchTerm, setSearchTerm] = useState(initialValue);
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		// Sync with URL on component mount
		const search = searchParams.get('s');
		if (search) {
			setSearchTerm(search);
			onSearch(search);
		}
	}, [searchParams, onSearch]);
	const handleSearch = () => {
		const params = new URLSearchParams();
		if (searchTerm) {
			params.set('s', searchTerm);
		} else {
			params.delete('s');
		}
		router.push(`?${params.toString()}`, { scroll: false });
		onSearch(searchTerm);
	};

	const handleClear = () => {
		setSearchTerm('');
		router.push('', { scroll: false });
		onSearch('');
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
				placeholder='Search bloggers by name, city, or country...'
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
				Search
			</Button>
		</div>
	);
}
