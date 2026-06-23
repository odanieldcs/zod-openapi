import * as HttpStatusCodes from 'stoker/http-status-codes';
import { AppError } from './app-error.js';

export class ConflictError extends AppError {
	constructor(message: string, code = 'CONFLICT') {
		super(message, HttpStatusCodes.CONFLICT, code);
	}
}
