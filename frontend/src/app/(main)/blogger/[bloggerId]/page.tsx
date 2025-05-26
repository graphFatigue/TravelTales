import { notFound } from 'next/navigation';
import api from '@/lib/api/api';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import ProfilePageClient from './ProfilePageClient';

export const getBlogger = async (bloggerId: string, token?: string) => {
	const headers = token ? { Authorization: `Bearer ${token}` } : {};
	const { data: blogger } = await api.get(`/api/Blogger/${bloggerId}`, {
		headers,
	});
	if (!blogger) notFound();
	return blogger;
};

export default async function Page({
	params,
}: {
	params: Promise<{ bloggerId: string }>;
}) {
	const { bloggerId } = await params;
	const session = await getServerSession(authOptions);
	const blogger = await getBlogger(bloggerId, session?.accessToken);

	return <ProfilePageClient initialBlogger={blogger} session={session} />;
}

