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

export default function UserFilterComponent() {
	const router = useRouter();
	const searchParams = useSearchParams();
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
		<div className='flex gap-2'>
			<Select
				value={searchField}
				onValueChange={value => setSearchField(value as any)}
			>
				<SelectTrigger className='w-[180px]'>
					<SelectValue placeholder='Search by' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='id'>ID</SelectItem>
					<SelectItem value='email'>Email</SelectItem>
					<SelectItem value='blogger.firstName'>First Name</SelectItem>
					<SelectItem value='blogger.lastName'>Last Name</SelectItem>
				</SelectContent>
			</Select>

			<Input
				type='text'
				value={searchValue}
				onChange={e => setSearchValue(e.target.value)}
				placeholder={`Search by ${searchField.replace('blogger.', '')}...`}
				className='w-[300px]'
				onKeyDown={e => e.key === 'Enter' && handleSearchSubmit()}
			/>

			<Button onClick={handleSearchSubmit}>Search</Button>
      <Button
        variant={'secondary'}
				onClick={() => {
					setSearchValue('');
					handleSearchSubmit();
				}}
			>
				Reset
			</Button>
		</div>
	);
}
