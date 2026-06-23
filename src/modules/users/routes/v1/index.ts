import { type Router as ExpressRouter, Router } from 'express';
import { mountRoute } from '../../../../lib/http/define-route.js';
import { getUsersRoute } from './get-users.js';
import { postUserRoute } from './post-user.js';

export const usersV1Router: ExpressRouter = Router();

mountRoute(usersV1Router, getUsersRoute);
mountRoute(usersV1Router, postUserRoute);
