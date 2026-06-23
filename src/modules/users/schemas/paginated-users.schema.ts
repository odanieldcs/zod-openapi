import { registry } from '../../../lib/openapi.js';
import { paginatedResponse } from '../../../shared/schemas/pagination.schema.js';
import { UserSchema } from './user.schema.js';

export const PaginatedUsersSchema = paginatedResponse(
	UserSchema,
	'PaginatedUsers',
);

registry.register('PaginatedUsers', PaginatedUsersSchema);
