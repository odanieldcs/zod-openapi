# Zod + OpenAPI Demo API

A modular Express API where **Zod schemas are the single source of truth** for runtime validation and OpenAPI documentation. The spec is generated at startup and served interactively via [Scalar](https://scalar.com/).

Built as a reference architecture for talks and projects that need type-safe APIs with zero drift between docs and behavior.

## Stack

| Tool                                                                               | Role                              |
| ---------------------------------------------------------------------------------- | --------------------------------- |
| [Express 5](https://expressjs.com/)                                                | HTTP server                       |
| [Zod 4](https://zod.dev/)                                                          | Schema validation                 |
| [@asteasolutions/zod-to-openapi](https://github.com/asteasolutions/zod-to-openapi) | OpenAPI spec generation from Zod  |
| [Scalar](https://github.com/scalar/scalar)                                         | Interactive API reference UI      |
| [stoker](https://github.com/w3cj/stoker)                                           | HTTP status code constants        |
| [tsx](https://github.com/privatenumber/tsx)                                        | TypeScript execution (dev & prod) |

## Quick start

**Requirements:** Node.js 24+, [pnpm](https://pnpm.io/)

```bash
pnpm install
pnpm dev
```

| URL                             | Description                        |
| ------------------------------- | ---------------------------------- |
| http://localhost:3000/docs      | Interactive API reference (Scalar) |
| http://localhost:3000/docs.json | Raw OpenAPI 3.1 spec               |
| http://localhost:3000/api/users | Users API base path                |

Production:

```bash
pnpm start
```

Set `PORT` to override the default `3000`.

## Current endpoints

| Method | Path         | Description            |
| ------ | ------------ | ---------------------- |
| `GET`  | `/api/users` | List users (paginated) |
| `POST` | `/api/users` | Create a user          |

## Architecture

```
Request
  → defineRoute (validation + OpenAPI registration)
  → Service (business rules, returns Result)
  → Command / Query (data layer)
  → In-memory Store
```

Each **module** (e.g. `users`) owns its schemas, data layer, services, routes, and OpenAPI metadata. Shared infrastructure lives under `shared/` and `lib/`.

```
src/
├── app.ts                         # Bootstrap: modules, docs, error handler
├── lib/
│   ├── zod.ts                     # extendZodWithOpenApi — called once
│   ├── openapi.ts                 # Registry + generateOpenAPIDocument()
│   └── http/
│       ├── define-route.ts        # Unifies registerPath + validate + handler
│       ├── result.ts              # ok() / fail() Result type
│       └── send-result.ts         # Result → HTTP response
├── shared/
│   ├── errors/                    # AppError hierarchy + HttpStatusCodes
│   ├── middleware/                # validate, error-handler
│   ├── schemas/                   # Error, ValidationError, pagination factory
│   └── openapi/
│       ├── document-config.ts     # info, tags, servers
│       └── response-components.ts # Reusable OpenAPI response refs
└── modules/
    ├── index.ts                   # registerAllModules(app)
    └── users/                     # Reference module
        ├── openapi.ts             # Tag, operationIds, examples
        ├── schemas/
        ├── data/                  # store, queries, commands
        ├── services/
        └── routes/v1/
```

### Core ideas

**`defineRoute`** — One function registers the OpenAPI path, applies Zod validation middleware, and runs the handler. The same schema used in `validate` is used in `registerPath`, so docs and runtime cannot diverge.

**`Result<T>`** — Services return `ok(data, status?)` or `fail(appError)` instead of touching `res` directly. Only `sendResult` writes HTTP responses.

**Module registry** — Adding a module means registering it in `modules/index.ts`. `app.ts` stays unchanged.

## Error format

All errors follow a consistent JSON shape:

```json
{
	"error": "Validation failed",
	"statusCode": 400,
	"details": {
		"body": [{ "path": ["email"], "message": "Invalid email" }]
	}
}
```

`details` is present only for validation errors (`400`).

## Extending the API

Use `modules/users/` as a template. To add a new domain (e.g. `products`):

### 1. Create the module skeleton

```
src/modules/products/
├── index.ts
├── openapi.ts
├── schemas/
│   └── product.schema.ts
├── data/
│   ├── store.ts
│   ├── queries/
│   └── commands/
├── services/
└── routes/v1/
    ├── index.ts
    └── post-product.ts
```

### 2. Define schemas

Import `z` from `lib/zod.js` (after OpenAPI extension). Register components and add descriptions:

```typescript
import { registry } from '../../../lib/openapi.js';
import { z } from '../../../lib/zod.js';

export const ProductSchema = z
	.object({
		id: z.uuid().openapi({ description: 'Product ID', example: '...' }),
		name: z.string().min(1).openapi({ description: 'Product name' }),
	})
	.openapi('Product', { description: 'A product in the catalog' });

registry.register('Product', ProductSchema);
```

### 3. Implement data layer and services

- **Queries** — read-only functions `(store, input) → data`
- **Commands** — write functions that mutate the store immutably
- **Services** — orchestrate queries/commands, return `Result<T>` with `ok()` / `fail()`

### 4. Add OpenAPI metadata

Create `modules/products/openapi.ts` with the tag name, operation summaries/descriptions, operationIds, and request/response examples.

Register the tag in `shared/openapi/document-config.ts`:

```typescript
tags: [
  { name: 'Users', description: '...' },
  { name: 'Products', description: 'Product catalog operations.' },
],
```

### 5. Define routes with `defineRoute`

```typescript
import { defineRoute } from '../../../../lib/http/define-route.js';
import { HttpStatusCodes } from '../../../../shared/errors/index.js';
import { ValidationErrorResponse } from '../../../../shared/openapi/response-components.js';
import { productsOpenApi } from '../../openapi.js';
import { CreateProductSchema } from '../../schemas/create-product.schema.js';
import { ProductSchema } from '../../schemas/product.schema.js';
import { createProductService } from '../../services/create-product.js';

export const postProductRoute = defineRoute({
	...productsOpenApi.operations.createProduct,
	method: 'post',
	path: '/products', // OpenAPI path (server prefix is /api)
	mountPath: '/', // Express mount path relative to module basePath
	tags: [productsOpenApi.tag],
	request: {
		body: {
			description: 'Product creation payload',
			content: {
				'application/json': {
					schema: CreateProductSchema,
					example: productsOpenApi.examples.createProductRequest,
				},
			},
			required: true,
		},
	},
	responses: {
		[HttpStatusCodes.CREATED]: {
			description: 'Product created',
			content: { 'application/json': { schema: ProductSchema } },
		},
		[HttpStatusCodes.BAD_REQUEST]: ValidationErrorResponse.ref,
	},
	validate: { body: CreateProductSchema },
	handler: (req) => createProductService(req.body),
});
```

Mount routes in `routes/v1/index.ts` with `mountRoute(router, postProductRoute)`.

### 6. Register the module

```typescript
// modules/products/index.ts
export const productsModule = {
	basePath: '/api/products',
	router: productsV1Router,
};

// modules/index.ts
import { productsModule } from './products/index.js';

const modules = [usersModule, productsModule];
```

No changes to `app.ts` are required. Route files are imported through the module's router, which triggers `registerPath` side effects and populates the OpenAPI registry before `generateOpenAPIDocument()` runs.

### Checklist

- [ ] Schemas registered with `registry.register()` and `.openapi()` metadata
- [ ] Tag added to `shared/openapi/document-config.ts`
- [ ] `modules/{name}/openapi.ts` with operationIds and examples
- [ ] Routes use `defineRoute` with matching `validate` and `request` schemas
- [ ] Services return `Result` — no hardcoded status codes in routes
- [ ] Reuse `ValidationErrorResponse.ref` for `400` responses
- [ ] Verify `/docs` and `/docs.json` after changes

## OpenAPI documentation

Documentation is co-located with code:

| Layer                        | Where                                              |
| ---------------------------- | -------------------------------------------------- |
| Global info, tags, servers   | `shared/openapi/document-config.ts`                |
| Reusable error responses     | `shared/openapi/response-components.ts`            |
| Module operations & examples | `modules/{name}/openapi.ts`                        |
| Field-level descriptions     | `.openapi({ description, example })` on Zod fields |
| Per-route request/response   | Route files via `defineRoute` config               |

All user-facing documentation text is in **English**.

## Scripts

| Command                  | Description                         |
| ------------------------ | ----------------------------------- |
| `pnpm dev`               | Start with hot reload (`tsx watch`) |
| `pnpm start`             | Start the server                    |
| `pnpm exec tsc --noEmit` | Type-check without emitting         |

## License

ISC — Daniel Castro
