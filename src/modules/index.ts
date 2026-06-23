import type { Express } from 'express';
import { usersModule } from './users/index.js';

const modules = [usersModule];

export function registerAllModules(app: Express) {
	for (const mod of modules) {
		app.use(mod.basePath, mod.router);
	}
}
