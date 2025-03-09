'use server';

import { prisma } from '@/lib/prisma';
import { signUpSchema, SignUpValues } from '@/lib/validation';
import { hash } from '@node-rs/argon2';
import { generateIdFromEntropySize } from 'lucia';
import { lucia } from '@/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { isRedirectError } from 'next/dist/client/components/redirect';

export async function signup(
	credentials: SignUpValues
): Promise<{ error: string }> {
	try {
		const { username, email, password } = signUpSchema.parse(credentials);

		const passwordHash = await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1,
		});
		const userId = generateIdFromEntropySize(10);

		const existingUsername = await prisma.user.findFirst({
			where: {
				username: {
					equals: username,
					mode: 'insensitive',
				},
			},
		});

		if (existingUsername) {
			return {
				error: 'Username already taken.',
			};
		}

		const existingEmail = await prisma.user.findFirst({
			where: {
				email: {
					equals: email,
					mode: 'insensitive',
				},
			},
		});

		if (existingEmail) {
			return {
				error: 'Email already taken.',
			};
		}

		await prisma.user.create({
			data: {
				id: userId,
				username,
				email,
				displayName: username,
				passwordHash,
			},
		});

		const session = await lucia.createSession(userId, {});

		const sessionCookier = lucia.createSessionCookie(session.id);

		const cookiesStore = await cookies();
		cookiesStore.set(
			sessionCookier.name,
			sessionCookier.value,
			sessionCookier.attributes
		);

		return redirect('/');
    } catch (error) {
        if(isRedirectError(error)) throw error;
		console.log(error);
		return {
			error: 'Something went wrong. Please try againg.',
		};
	}
}
