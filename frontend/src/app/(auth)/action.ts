'use server';

import { redirect } from 'next/navigation';

export async function logout() {
	return redirect('/login');
}
