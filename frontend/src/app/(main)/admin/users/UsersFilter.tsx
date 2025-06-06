/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
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

	const handleSearchSubmit = () => {
		const params = new URLSearchParams();

		if (searchValue) {
			params.set('field', searchField);
			params.set('value', searchValue);
		}

		params.set('page', '1');

		router.push(`/admin/users?${params.toString()}`);
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
				<Input
					placeholder={t('users.searchByField', {
						field: searchField.replace('blogger.', ''),
					})}
					className='pl-10'
					value={searchValue}
					onChange={e => setSearchValue(e.target.value)}
					onKeyDown={e => e.key === 'Enter' && handleSearchSubmit()}
				/>
			</div>
			<Button onClick={handleSearchSubmit}>{t('users.search')}</Button>
			<Button
				variant={'secondary'}
				onClick={() => {
					setSearchValue('');
					handleSearchSubmit();
				}}
			>
				{t('users.reset')}
			</Button>
		</div>
	);
}
