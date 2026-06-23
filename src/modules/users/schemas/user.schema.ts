import { registry } from '../../../lib/openapi.js';
import { z } from '../../../lib/zod.js';

export const UserSchema = z
	.object({
		id: z.uuid().openapi({
			description: 'Unique user identifier (UUID v4)',
			example: '123e4567-e89b-12d3-a456-426614174000',
		}),
		name: z.string().min(2).max(100).openapi({
			description: 'Full display name',
			example: 'Daniel Castro',
		}),
		email: z.email().openapi({
			description: 'Unique email address',
			example: 'daniel@example.com',
		}),
		role: z.enum(['admin', 'member']).openapi({
			description: 'Access role. `admin` has elevated permissions.',
			example: 'member',
		}),
		createdAt: z.iso.datetime().openapi({
			description: 'Account creation timestamp (ISO 8601)',
			example: '2024-01-15T10:30:00.000Z',
		}),
	})
	.openapi('User', {
		description: 'A persisted user account in the system.',
	});

export type User = z.infer<typeof UserSchema>;

registry.register('User', UserSchema);
