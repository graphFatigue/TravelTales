import { z } from 'zod';

export const registrationSchema = z.object({
	firstName: z
		.string()
		.min(2, 'First name must be at least 2 characters')
		.max(30, 'First name must be at most 30 characters'),
	lastName: z
		.string()
		.min(2, 'Last name must be at least 2 characters')
		.max(40, 'Last name must be at most 40 characters'),
	email: z.string().email('Invalid email address'),
	password: z
		.string()
		.min(6, 'Password must be at least 6 characters')
		.max(100, 'Password must be at most 100 characters'),
	birthDate: z.date({
		required_error: 'Birthdate is required',
		invalid_type_error: 'Invalid date',
	}),
	// .min(new Date(1900, 0, 1), 'Birthdate must be after Jan 1, 1900')
	// .max(
	// 	new Date(new Date().setFullYear(new Date().getFullYear() - 13)),
	// 	'You must be at least 13 years old',
	// ),
});

export const postFormSchema = z.object({
	title: z.string().trim().min(1, 'Title is required').max(100),
	content: z.string().trim().min(1, 'Content is required').max(5000),
	bloggerId: z.number().int().positive(),
	cityId: z.number().int().positive().optional(),
	countryId: z.number().int().positive().optional(),
	budget: z.number().int().min(0).max(4).default(0),
	categoryIds: z
		.array(z.number().int().positive())
		.min(1, 'At least one category is required'),
	tags: z
		.array(z.string().min(1).max(30))
		.optional()
		.refine(tags => tags?.length === new Set(tags).size, {
			message: 'Tags must be unique',
		}),
	attachments: z
		.array(
			z.object({
				number: z.number().int().positive(),
				file: z.instanceof(File).optional(),
				previewUrl: z.string().optional(),
				id: z.number().int().positive().optional(),
			}),
		)
		.max(10)
		.optional(),
});

export type PostFormValues = z.infer<typeof postFormSchema>;


export const formSchema = z.object({
	name: z.string().min(1, 'Name is required').max(100),
	description: z.string().min(1, 'Description is required').max(500),
});

export type CategoryFormValues = z.infer<typeof formSchema>;

export const profileFormSchema = z.object({
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
	birthDate: z.string().optional(),
	sex: z.number(),
	bio: z.string().optional(),
	countryId: z.number().optional(),
	cityId: z.number().optional(),
	visitedCityIds: z.array(z.number()).optional(),
	visitedCountryIds: z.array(z.number()).optional(),
});

export type UpdateBloggerProfileValues = z.infer<typeof profileFormSchema>;
