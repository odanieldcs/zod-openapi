import type { Router } from 'express';
import { usersV1Router } from './routes/v1/index.js';

export const usersModule: { basePath: string; router: Router } = {
	basePath: '/api/users',
	router: usersV1Router,
};
