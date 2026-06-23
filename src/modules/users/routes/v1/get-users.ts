import { defineRoute } from '../../../../lib/http/define-route.js';
import { HttpStatusCodes } from '../../../../shared/errors/index.js';
import { usersOpenApi } from '../../openapi.js';
import { PaginatedUsersSchema } from '../../schemas/paginated-users.schema.js';
import { listUsersService } from '../../services/list-users.js';

export const getUsersRoute = defineRoute({
	...usersOpenApi.operations.listUsers,
	method: 'get',
	path: '/users',
	mountPath: '/',
	tags: [usersOpenApi.tag],
	responses: {
		[HttpStatusCodes.OK]: {
			description: 'Paginated list of users',
			content: {
				'application/json': {
					schema: PaginatedUsersSchema,
					example: usersOpenApi.examples.listUsersResponse,
				},
			},
		},
	},
	handler: () => listUsersService(),
});
