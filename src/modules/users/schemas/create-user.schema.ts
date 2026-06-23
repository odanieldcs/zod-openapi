import { registry } from '../../../lib/openapi.js';
import type { z } from '../../../lib/zod.js';
import { UserSchema } from './user.schema.js';

export const CreateUserSchema = UserSchema.omit({
	id: true,
	createdAt: true,
}).openapi('CreateUser', {
	description:
		'Payload required to create a new user. Server assigns id and createdAt.',
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

registry.register('CreateUser', CreateUserSchema);
