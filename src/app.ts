import './lib/zod.js';
import './shared/schemas/error.schema.js';
import './shared/schemas/validation-error.schema.js';
import './shared/openapi/response-components.js';

import { apiReference } from '@scalar/express-api-reference';
import express from 'express';
import { generateOpenAPIDocument } from './lib/openapi.js';
import { registerAllModules } from './modules/index.js';
import { errorHandler } from './shared/middleware/error-handler.js';

const app = express();
app.use(express.json());

registerAllModules(app);

const openApiSpec = generateOpenAPIDocument();

app.use(
	'/docs',
	apiReference({
		spec: {
			content: openApiSpec,
		},
	}),
);

app.get('/docs.json', (_req, res) => {
	res.json(openApiSpec);
});

app.use(errorHandler);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
	console.log(`🚀 Server running at http://localhost:${PORT}`);
	console.log(`📚 Docs available at http://localhost:${PORT}/docs`);
	console.log(`📄 OpenAPI spec at http://localhost:${PORT}/docs.json`);
});
