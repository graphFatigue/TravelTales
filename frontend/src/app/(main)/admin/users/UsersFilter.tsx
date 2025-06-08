/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';

export default function UserFilterComponent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { t } = useTranslation();
	const [searchField, setSearchField] = useState<
		'id' | 'email' | 'blogger.firstName' | 'blogger.lastName'
	>((searchParams.get('field') as any) || 'blogger.firstName');
	const [searchValue, setSearchValue] = useState(
		searchParams.get('value') || '',
	);

	useEffect(() => {
		const field = searchParams.get('field');
		const value = searchParams.get('value');

		if (
			field &&
			['id', 'email', 'blogger.firstName', 'blogger.lastName'].includes(field)
		) {
			setSearchField(field as any);
		}

		if (value) {
			setSearchValue(value);
		}
	}, [searchParams]);

	const handleSearchSubmit = () => {
		const params = new URLSearchParams();

		if (searchValue) {
			params.set('field', searchField);
			params.set('value', searchValue);
		} else {
			params.delete('field');
			params.delete('value');
		}

		params.set('page', '1');

		router.push(`/admin/users?${params.toString()}`);
	};

	const handleReset = () => {
		setSearchValue('');
		setSearchField('blogger.firstName');
		router.push('/admin/users?page=1');
	};

	return (
		<div className='flex items-center gap-2'>
			<Select
				value={searchField}
				onValueChange={value => setSearchField(value as any)}
			>
				<SelectTrigger className='w-[180px]'>
					<SelectValue placeholder={t('users.searchBy')} />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='id'>ID</SelectItem>
					<SelectItem value='email'>{t('users.email')}</SelectItem>
					<SelectItem value='blogger.firstName'>
						{t('users.firstName')}
					</SelectItem>
					<SelectItem value='blogger.lastName'>
						{t('users.lastName')}
					</SelectItem>
				</SelectContent>
			</Select>
			<div className='relative flex-1'>
				<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground' />
				<Input
					placeholder={t('users.searchByField', {
						field: searchField.replace('blogger.', ''),
					})}
					className='pl-10'
					value={searchValue}
					onChange={e => setSearchValue(e.target.value)}
					onKeyDown={e => e.key === 'Enter' && handleSearchSubmit()}
				/>
				{searchValue && (
					<X
						className='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform cursor-pointer text-muted-foreground'
						onClick={handleReset}
					/>
				)}
			</div>
			<Button onClick={handleSearchSubmit}>{t('users.search')}</Button>
		</div>
	);
}
