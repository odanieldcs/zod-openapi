import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/app-error.js';
import { HttpStatusCodes } from '../errors/index.js';
import { toErrorResponse } from '../errors/to-error-response.js';

export function errorHandler(
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
): void {
	if (err instanceof AppError) {
		res.status(err.statusCode).json(toErrorResponse(err));
		return;
	}

	console.error(err);
	res
		.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
		.json(toErrorResponse(new AppError('Internal server error')));
}
