import { z } from 'zod';

type TranslationFunction = (
	key: string,
	options?: Record<string, unknown>,
) => string;

export const getRegistrationSchema = (t: TranslationFunction) =>
	z.object({
		firstName: z
			.string()
			.min(2, t('validation.firstName.min'))
			.max(30, t('validation.firstName.max')),
		lastName: z
			.string()
			.min(2, t('validation.lastName.min'))
			.max(40, t('validation.lastName.max')),
		email: z.string().email(t('validation.email')),
		password: z
			.string()
			.min(6, t('validation.password.min'))
			.max(100, t('validation.password.max')),
		birthDate: z
			.string()
			.refine(val => !isNaN(new Date(val).getTime()), {
				message: t('validation.invalidDate'),
			})
			.refine(val => new Date(val) > new Date(1900, 0, 1), {
				message: t('validation.birthDateMin'),
			})
			.refine(
				val =>
					new Date(val) <=
					new Date(new Date().setFullYear(new Date().getFullYear() - 13)),
				{
					message: t('validation.minAge'),
				},
			),
	});

export const getPostFormSchema = (t: TranslationFunction) =>
	z.object({
		title: z
			.string()
			.trim()
			.min(1, t('validation.title.required'))
			.max(100, t('validation.title.max')),
		content: z
			.string()
			.trim()
			.min(1, t('validation.content.required'))
			.max(5000, t('validation.content.max')),
		bloggerId: z.number().int().positive(),
		cityId: z.number().int().positive().optional(),
		countryId: z.number().int().positive().optional(),
		budget: z.number().int().min(0).max(4).default(0),
		categoryIds: z
			.array(z.number().int().positive())
			.min(1, t('validation.categories.required')),
		tags: z
			.array(z.string().min(1).max(30, t('validation.tags.max')))
			.optional()
			.refine(tags => tags?.length === new Set(tags).size, {
				message: t('validation.uniqueTags'),
			}),
		attachments: z
			.array(
				z.object({
					number: z.number().int().positive(),
					file: z
						.instanceof(File)
						.optional()
						.refine(file => !file || file.size <= 2 * 1024 * 1024, {
							message: t('validation.attachments.fileSize', { maxSize: 2 }),
						})
						.refine(
							file => {
								if (!file) return true;
								const validTypes = [
									'image/jpeg',
									'image/png',
									'image/avi',
									'video/mp4',
									'video/mov',
								];
								return validTypes.includes(file.type);
							},
							{
								message: t('validation.attachments.fileType'),
							},
						),
					previewUrl: z.string().optional(),
					id: z.number().int().positive().optional(),
					type: z.string().optional(),
				}),
			)
			.max(10, t('validation.attachments.max'))
			.optional(),
	});

export const getCategoryFormSchema = (t: (key: string) => string) =>
	z.object({
		name: z
			.string()
			.min(1, t('validation.name.required'))
			.max(100, t('validation.name.max')),
		description: z
			.string()
			.min(1, t('validation.description.required'))
			.max(500, t('validation.description.max')),
		nameUa: z
			.string()
			.min(1, t('validation.name.required'))
			.max(100, t('validation.name.max')),
		descriptionUa: z
			.string()
			.min(1, t('validation.description.required'))
			.max(500, t('validation.description.max')),
	});

export const getProfileFormSchema = (t: (key: string) => string) =>
	z.object({
		firstName: z.string().min(1, t('validation.firstName.min')),
		lastName: z.string().min(1, t('validation.lastName.min')),
		birthDate: z.string().optional(),
		sex: z.number(),
		bio: z.string().optional(),
		countryId: z.number().optional(),
		cityId: z.number().optional(),
		visitedCityIds: z.array(z.number()).optional(),
		visitedCountryIds: z.array(z.number()).optional(),
	});

export const getForgotPasswordFormSchema = (t: (key: string) => string) =>
	z.object({
		email: z.string().email(t('validation.email')),
	});

export const getResetPasswordFormSchema = (t: TranslationFunction) =>
	z
		.object({
			email: z.string().email(t('validation.email')),
			token: z.string().min(1, t('validation.required', { field: 'Token' })),
			newPassword: z.string().min(8, t('validation.password.min')),
			confirmPassword: z.string().min(8, t('validation.password.min')),
		})
		.refine(data => data.newPassword === data.confirmPassword, {
			message: t('validation.passwordsMatch'),
			path: ['confirmPassword'],
		});

export type registrationValues = z.infer<
	ReturnType<typeof getRegistrationSchema>
>;

export type PostFormValues = z.infer<ReturnType<typeof getPostFormSchema>>;
export type CategoryFormValues = z.infer<
	ReturnType<typeof getCategoryFormSchema>
>;
export type UpdateBloggerProfileValues = z.infer<
	ReturnType<typeof getProfileFormSchema>
>;
export type ForgotPasswordValues = z.infer<
	ReturnType<typeof getForgotPasswordFormSchema>
>;
export type ResetPasswordValues = z.infer<
	ReturnType<typeof getResetPasswordFormSchema>
>;
