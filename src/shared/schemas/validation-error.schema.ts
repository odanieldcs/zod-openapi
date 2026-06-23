import { registry } from '../../lib/openapi.js';
import { z } from '../../lib/zod.js';

export const ValidationErrorSchema = z
	.object({
		error: z.string().openapi({ example: 'Validation failed' }),
		statusCode: z.number().openapi({ example: 400 }),
		details: z
			.record(z.string(), z.array(z.any()))
			.optional()
			.openapi({ example: { body: [{ message: 'Required' }] } }),
	})
	.openapi('ValidationError');

registry.register('ValidationError', ValidationErrorSchema);
