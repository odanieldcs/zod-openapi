import type { User } from '../schemas/user.schema.js';

export interface UserStore {
	getAll(): readonly User[];
	insert(user: User): User;
}

function createUserStore(seed: readonly User[]): UserStore {
	let users: readonly User[] = [...seed];

	return {
		getAll() {
			return users;
		},

		insert(user: User) {
			users = [...users, user];
			return user;
		},
	};
}

export const userStore = createUserStore([
	{
		id: '550e8400-e29b-41d4-a716-446655440000',
		name: 'Daniel Oliveira',
		email: 'daniel@example.com',
		role: 'admin',
		createdAt: new Date().toISOString(),
	},
]);
