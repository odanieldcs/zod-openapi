import type { NextFunction, Request, Response } from 'express';
import type { z } from 'zod';
import { ValidationError } from '../errors/validation-error.js';

export interface ValidateSchemas {
	body?: z.ZodTypeAny;
	params?: z.ZodTypeAny;
	query?: z.ZodTypeAny;
}

function parseWith(
	schema: z.ZodTypeAny,
	data: unknown,
):
	| { success: true; data: unknown }
	| { success: false; issues: z.ZodIssue[] } {
	const result = schema.safeParse(data);
	return result.success
		? { success: true, data: result.data }
		: { success: false, issues: result.error.issues };
}

export function validate(schemas: ValidateSchemas) {
	return (req: Request, _res: Response, next: NextFunction): void => {
		const errors: Record<string, z.ZodIssue[]> = {};

		if (schemas.body) {
			const result = parseWith(schemas.body, req.body);
			if (!result.success) errors.body = result.issues;
			else req.body = result.data;
		}

		if (schemas.params) {
			const result = parseWith(schemas.params, req.params);
			if (!result.success) errors.params = result.issues;
			else Object.assign(req.params, result.data);
		}

		if (schemas.query) {
			const result = parseWith(schemas.query, req.query);
			if (!result.success) errors.query = result.issues;
			else Object.assign(req.query, result.data);
		}

		if (Object.keys(errors).length > 0) {
			next(new ValidationError('Validation failed', errors));
			return;
		}

		next();
	};
}
