import { registry } from '../../lib/openapi.js';

export const ValidationErrorResponse = registry.registerComponent(
	'responses',
	'ValidationError',
	{
		description: 'Invalid request payload — field-level details included',
		content: {
			'application/json': {
				schema: { $ref: '#/components/schemas/ValidationError' },
				example: {
					error: 'Validation failed',
					statusCode: 400,
					details: {
						body: [{ path: ['email'], message: 'Invalid email' }],
					},
				},
			},
		},
	},
);

registry.registerComponent('securitySchemes', 'bearerAuth', {
	type: 'http',
	scheme: 'bearer',
	bearerFormat: 'JWT',
	description:
		'JWT obtained from the authentication endpoint (not implemented in this demo).',
});
