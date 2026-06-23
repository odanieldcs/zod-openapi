import { registry } from '../../../lib/openapi.js';
import { z } from '../../../lib/zod.js';

export const UserSchema = z
	.object({
		id: z.uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
		name: z.string().min(2).max(100).openapi({ example: 'Daniel Castro' }),
		email: z.email().openapi({ example: 'daniel@example.com' }),
		role: z.enum(['admin', 'member']).openapi({ example: 'member' }),
		createdAt: z.date().openapi({ example: new Date() }),
	})
	.openapi('User');

export type User = z.infer<typeof UserSchema>;

registry.register('User', UserSchema);
