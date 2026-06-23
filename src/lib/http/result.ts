import * as HttpStatusCodes from 'stoker/http-status-codes';
import type { AppError } from '../../shared/errors/app-error.js';

export type Result<T> =
	| { ok: true; data: T; status: number }
	| { ok: false; error: AppError };

export const ok = <T>(
	data: T,
	status: number = HttpStatusCodes.OK,
): Result<T> => ({ ok: true, data, status });

export const fail = (error: AppError): Result<never> => ({
	ok: false,
	error,
});
