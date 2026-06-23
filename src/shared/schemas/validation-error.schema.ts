import { registry } from '../../lib/openapi.js';
import { z } from '../../lib/zod.js';

export const ValidationErrorSchema = z
	.object({
		error: z.string().openapi({
			description: 'Human-readable error message',
			example: 'Validation failed',
		}),
		statusCode: z.number().openapi({
			description: 'HTTP status code for the error',
			example: 400,
		}),
		details: z
			.record(z.string(), z.array(z.any()))
			.optional()
			.openapi({
				description:
					'Field-level validation issues keyed by location (e.g. `body`). Each entry is a Zod issue with `path` and `message`.',
				example: { body: [{ path: ['email'], message: 'Invalid email' }] },
			}),
	})
	.openapi('ValidationError', {
		description: 'Validation error with optional field-level details.',
	});

registry.register('ValidationError', ValidationErrorSchema);
