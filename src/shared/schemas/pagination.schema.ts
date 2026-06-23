import { z } from '../../lib/zod.js';

export function paginatedResponse<T extends z.ZodTypeAny>(
	itemSchema: T,
	name: string,
) {
	return z
		.object({
			data: z.array(itemSchema),
			total: z.number().openapi({ example: 42 }),
			page: z.number().openapi({ example: 1 }),
			pageSize: z.number().openapi({ example: 20 }),
		})
		.openapi(name);
}
