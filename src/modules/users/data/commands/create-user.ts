import type { CreateUserInput } from '../../schemas/create-user.schema.js';
import type { User } from '../../schemas/user.schema.js';
import type { UserStore } from '../store.js';

export function createUser(store: UserStore, input: CreateUserInput): User {
	const user: User = {
		id: crypto.randomUUID(),
		...input,
		createdAt: new Date().toISOString(),
	};
	return store.insert(user);
}
