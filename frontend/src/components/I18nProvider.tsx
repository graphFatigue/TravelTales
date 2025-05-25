'use client';

import { ReactNode, useEffect } from 'react';
import i18n from '@/lib/i18n';
import { I18nextProvider } from 'react-i18next';

export default function I18nProvider({ children }: { children: ReactNode }) {
	useEffect(() => {
		const savedLang = localStorage.getItem('i18nextLng');
		if (savedLang) {
			i18n.changeLanguage(savedLang);
		}
    }, []);

	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

