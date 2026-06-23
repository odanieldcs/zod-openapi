import type { AppError } from './app-error.js';
import { ValidationError } from './validation-error.js';

export function toErrorResponse(error: AppError) {
	return {
		error: error.message,
		statusCode: error.statusCode,
		...(error instanceof ValidationError && error.details
			? { details: error.details }
			: {}),
	};
}
