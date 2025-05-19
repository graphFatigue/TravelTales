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
