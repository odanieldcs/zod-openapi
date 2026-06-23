import { ok, type Result } from '../../../lib/http/result.js';
import { HttpStatusCodes } from '../../../shared/errors/index.js';
import { createUser } from '../data/commands/create-user.js';
import { userStore } from '../data/store.js';
import type { CreateUserInput } from '../schemas/create-user.schema.js';
import type { User } from '../schemas/user.schema.js';

export function createUserService(input: CreateUserInput): Result<User> {
	const user = createUser(userStore, input);
	return ok(user, HttpStatusCodes.CREATED);
}
