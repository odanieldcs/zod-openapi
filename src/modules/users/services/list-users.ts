import { ok, type Result } from '../../../lib/http/result.js';
import type { z } from '../../../lib/zod.js';
import { getAllUsers } from '../data/queries/get-all-users.js';
import { userStore } from '../data/store.js';
import type { PaginatedUsersSchema } from '../schemas/paginated-users.schema.js';

type PaginatedUsers = z.infer<typeof PaginatedUsersSchema>;

export function listUsersService(): Result<PaginatedUsers> {
	const users = getAllUsers(userStore);

	return ok({
		data: [...users],
		total: users.length,
		page: 1,
		pageSize: 20,
	});
}
