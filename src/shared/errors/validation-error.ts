import type { z } from 'zod';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { AppError } from './app-error.js';

export class ValidationError extends AppError {
	readonly details?: Record<string, z.ZodIssue[]>;

	constructor(message: string, details?: Record<string, z.ZodIssue[]>) {
		super(message, HttpStatusCodes.BAD_REQUEST, 'VALIDATION_ERROR');
		if (details !== undefined) {
			this.details = details;
		}
	}
}
