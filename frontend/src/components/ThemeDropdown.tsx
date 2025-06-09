'use client';

import { useTranslation } from 'react-i18next';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ThemeDropdown() {
	const { theme, setTheme } = useTheme();
	const { t } = useTranslation();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' className='flex items-center gap-2'>
					<Monitor className='h-4 w-4' />
					{t('dashboard.theme')}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem onClick={() => setTheme('light')}>
					<Sun className='mr-2 size-4' />
					{t('dashboard.light')}
					{theme === 'light' && <Check className='ms-2 size-4' />}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('dark')}>
					<Moon className='mr-2 size-4' />
					{t('dashboard.dark')}
					{theme === 'dark' && <Check className='ms-2 size-4' />}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
