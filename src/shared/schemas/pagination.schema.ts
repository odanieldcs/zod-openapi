import { z } from '../../lib/zod.js';

export function paginatedResponse<T extends z.ZodTypeAny>(
	itemSchema: T,
	name: string,
	options?: { description?: string },
) {
	return z
		.object({
			data: z.array(itemSchema).openapi({
				description: 'Items for the current page',
			}),
			total: z.number().openapi({
				description: 'Total number of items across all pages',
				example: 42,
			}),
			page: z.number().openapi({
				description: 'Current page number (1-based)',
				example: 1,
			}),
			pageSize: z.number().openapi({
				description: 'Maximum number of items per page',
				example: 20,
			}),
		})
		.openapi(
			name,
			options?.description ? { description: options.description } : undefined,
		);
}
