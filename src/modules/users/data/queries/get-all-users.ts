import type { User } from '../../schemas/user.schema.js';
import type { UserStore } from '../store.js';

export function getAllUsers(store: UserStore): readonly User[] {
	return store.getAll();
}
