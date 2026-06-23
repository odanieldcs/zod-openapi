export const openApiDocumentConfig = {
	openapi: '3.1.0' as const,
	info: {
		title: 'Demo API',
		version: '1.0.0',
		description: `
Self-documented REST API powered by Zod and OpenAPI 3.1.

## Authentication
This demo does not require authentication.

## Errors
Error responses follow \`{ error, statusCode, details? }\`.
    `.trim(),
		contact: {
			name: 'Daniel Castro',
			email: 'daniel@example.com',
		},
		license: {
			name: 'ISC',
		},
	},
	tags: [
		{
			name: 'Users',
			description: 'User management. List and create accounts.',
		},
	],
	servers: [{ url: '/api', description: 'Local development server' }],
};
