import {
	OpenAPIRegistry,
	OpenApiGeneratorV31,
} from '@asteasolutions/zod-to-openapi';

export const registry = new OpenAPIRegistry();

export function generateOpenAPIDocument(): ReturnType<
	OpenApiGeneratorV31['generateDocument']
> {
	const generator = new OpenApiGeneratorV31(registry.definitions);

	return generator.generateDocument({
		openapi: '3.1.0',
		info: {
			title: 'Demo API',
			version: '1.0.0',
			description: 'Self-documented API powered by Zod + OpenAPI.',
		},
		servers: [{ url: '/api' }],
	});
}
