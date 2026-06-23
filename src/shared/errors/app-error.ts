import * as HttpStatusCodes from 'stoker/http-status-codes';

export class AppError extends Error {
	readonly statusCode: number;
	readonly code: string;

	constructor(
		message: string,
		statusCode: number = HttpStatusCodes.INTERNAL_SERVER_ERROR,
		code = 'INTERNAL_ERROR',
	) {
		super(message);
		this.name = new.target.name;
		this.statusCode = statusCode;
		this.code = code;
	}
}
