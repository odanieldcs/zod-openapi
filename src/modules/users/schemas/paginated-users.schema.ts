import { registry } from '../../../lib/openapi.js';
import { paginatedResponse } from '../../../shared/schemas/pagination.schema.js';
import { UserSchema } from './user.schema.js';

export const PaginatedUsersSchema = paginatedResponse(
	UserSchema,
	'PaginatedUsers',
	{ description: 'Paginated list of user accounts.' },
);

registry.register('PaginatedUsers', PaginatedUsersSchema);
