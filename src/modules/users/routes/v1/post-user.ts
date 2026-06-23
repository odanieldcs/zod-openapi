import { defineRoute } from '../../../../lib/http/define-route.js';
import { HttpStatusCodes } from '../../../../shared/errors/index.js';
import { ValidationErrorSchema } from '../../../../shared/schemas/validation-error.schema.js';
import { CreateUserSchema } from '../../schemas/create-user.schema.js';
import { UserSchema } from '../../schemas/user.schema.js';
import { createUserService } from '../../services/create-user.js';

export const postUserRoute = defineRoute({
	method: 'post',
	path: '/users',
	mountPath: '/',
	summary: 'Create a new user',
	tags: ['Users'],
	request: {
		body: {
			content: { 'application/json': { schema: CreateUserSchema } },
			required: true,
		},
	},
	responses: {
		[HttpStatusCodes.CREATED]: {
			description: 'User created',
			content: { 'application/json': { schema: UserSchema } },
		},
		[HttpStatusCodes.BAD_REQUEST]: {
			description: 'Invalid request data',
			content: { 'application/json': { schema: ValidationErrorSchema } },
		},
	},
	validate: { body: CreateUserSchema },
	handler: (req) => createUserService(req.body),
});
