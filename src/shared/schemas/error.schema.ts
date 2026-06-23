import { registry } from '../../lib/openapi.js';
import { z } from '../../lib/zod.js';

export const ErrorSchema = z
	.object({
		error: z.string().openapi({
			description: 'Human-readable error message',
			example: 'User not found',
		}),
		statusCode: z.number().openapi({
			description: 'HTTP status code for the error',
			example: 404,
		}),
	})
	.openapi('Error', {
		description: 'Standard error response returned by the API.',
	});

registry.register('Error', ErrorSchema);
