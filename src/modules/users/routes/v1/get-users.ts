import { defineRoute } from '../../../../lib/http/define-route.js';
import { HttpStatusCodes } from '../../../../shared/errors/index.js';
import { PaginatedUsersSchema } from '../../schemas/paginated-users.schema.js';
import { listUsersService } from '../../services/list-users.js';

export const getUsersRoute = defineRoute({
	method: 'get',
	path: '/users',
	mountPath: '/',
	summary: 'List all users',
	tags: ['Users'],
	responses: {
		[HttpStatusCodes.OK]: {
			description: 'Paginated list of users',
			content: {
				'application/json': { schema: PaginatedUsersSchema },
			},
		},
	},
	handler: () => listUsersService(),
});
