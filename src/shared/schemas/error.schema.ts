import { registry } from '../../lib/openapi.js';
import { z } from '../../lib/zod.js';

export const ErrorSchema = z
	.object({
		error: z.string().openapi({ example: 'User not found' }),
		statusCode: z.number().openapi({ example: 404 }),
	})
	.openapi('Error');

registry.register('Error', ErrorSchema);
