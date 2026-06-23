import {
	OpenAPIRegistry,
	OpenApiGeneratorV31,
} from '@asteasolutions/zod-to-openapi';
import { openApiDocumentConfig } from '../shared/openapi/document-config.js';

export const registry = new OpenAPIRegistry();

export function generateOpenAPIDocument(): ReturnType<
	OpenApiGeneratorV31['generateDocument']
> {
	const generator = new OpenApiGeneratorV31(registry.definitions);

	return generator.generateDocument(openApiDocumentConfig);
}
