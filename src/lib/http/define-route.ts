import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type {
	NextFunction,
	Request,
	RequestHandler,
	Response,
	Router,
} from 'express';
import {
	type ValidateSchemas,
	validate,
} from '../../shared/middleware/validate.js';
import { registry } from '../openapi.js';
import type { Result } from './result.js';
import { sendResult } from './send-result.js';

type HttpMethod = 'get' | 'post' | 'patch' | 'delete' | 'put';

export interface DefineRouteConfig {
	method: HttpMethod;
	path: string;
	mountPath: string;
	summary: string;
	description?: string;
	operationId?: string;
	deprecated?: boolean;
	tags: string[];
	request?: RouteConfig['request'];
	responses: RouteConfig['responses'];
	validate?: ValidateSchemas;
	handler: (req: Request) => Promise<Result<unknown>> | Result<unknown>;
}

export interface DefinedRoute {
	method: HttpMethod;
	mountPath: string;
	handlers: RequestHandler[];
}

export function defineRoute(config: DefineRouteConfig): DefinedRoute {
	registry.registerPath({
		method: config.method,
		path: config.path,
		summary: config.summary,
		tags: config.tags,
		...(config.description !== undefined
			? { description: config.description }
			: {}),
		...(config.operationId !== undefined
			? { operationId: config.operationId }
			: {}),
		...(config.deprecated !== undefined ? { deprecated: config.deprecated } : {}),
		...(config.request !== undefined ? { request: config.request } : {}),
		responses: config.responses,
	});

	const middlewares: RequestHandler[] = [];

	if (config.validate) {
		middlewares.push(validate(config.validate));
	}

	const routeHandler = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const result = await config.handler(req);
			sendResult(res, result);
		} catch (error) {
			next(error);
		}
	};

	return {
		method: config.method,
		mountPath: config.mountPath,
		handlers: [...middlewares, routeHandler],
	};
}

export function mountRoute(router: Router, route: DefinedRoute): void {
	router[route.method](route.mountPath, ...route.handlers);
}
