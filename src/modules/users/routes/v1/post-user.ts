import { defineRoute } from '../../../../lib/http/define-route.js';
import { HttpStatusCodes } from '../../../../shared/errors/index.js';
import { ValidationErrorResponse } from '../../../../shared/openapi/response-components.js';
import { usersOpenApi } from '../../openapi.js';
import { CreateUserSchema } from '../../schemas/create-user.schema.js';
import { UserSchema } from '../../schemas/user.schema.js';
import { createUserService } from '../../services/create-user.js';

export const postUserRoute = defineRoute({
	...usersOpenApi.operations.createUser,
	method: 'post',
	path: '/users',
	mountPath: '/',
	tags: [usersOpenApi.tag],
	request: {
		body: {
			description: 'Fields required to create a user',
			content: {
				'application/json': {
					schema: CreateUserSchema,
					example: usersOpenApi.examples.createUserRequest,
				},
			},
			required: true,
		},
	},
	responses: {
		[HttpStatusCodes.CREATED]: {
			description: 'User created',
			content: { 'application/json': { schema: UserSchema } },
		},
		[HttpStatusCodes.BAD_REQUEST]: ValidationErrorResponse.ref,
	},
	validate: { body: CreateUserSchema },
	handler: (req) => createUserService(req.body),
});
