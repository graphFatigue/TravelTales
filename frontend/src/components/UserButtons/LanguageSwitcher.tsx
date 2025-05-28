'use client';

import { useTranslation } from 'react-i18next';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
	const { i18n } = useTranslation();

	const changeLanguage = (lng: 'en' | 'uk') => {
		i18n.changeLanguage(lng);
		localStorage.setItem('i18nextLng', lng);
		document.cookie = `lang=${lng}; path=/`;
	};

	const currentLangLabel = i18n.language === 'uk' ? 'Українська' : 'English';

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' className='flex items-center gap-2'>
					<Globe className='h-4 w-4' />
					{currentLangLabel}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem
					disabled={i18n.language === 'en'}
					onClick={() => changeLanguage('en')}
				>
					English
				</DropdownMenuItem>
				<DropdownMenuItem
					disabled={i18n.language === 'uk'}
					onClick={() => changeLanguage('uk')}
				>
					Українська
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
