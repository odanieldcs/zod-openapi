import * as HttpStatusCodes from 'stoker/http-status-codes';
import { AppError } from './app-error.js';

export class NotFoundError extends AppError {
	constructor(message: string, code = 'NOT_FOUND') {
		super(message, HttpStatusCodes.NOT_FOUND, code);
	}
}
