import type { Response } from 'express';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { toErrorResponse } from '../../shared/errors/to-error-response.js';
import type { Result } from './result.js';

export function sendResult<T>(res: Response, result: Result<T>): void {
	if (result.ok) {
		if (result.status === HttpStatusCodes.NO_CONTENT) {
			res.status(result.status).send();
			return;
		}
		res.status(result.status).json(result.data);
		return;
	}

	const body = toErrorResponse(result.error);
	res.status(result.error.statusCode).json(body);
}
