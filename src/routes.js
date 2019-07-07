import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import AuthMidleware from './app/midlewares/auth';

const routes = new Router();

routes.get('/', (req, res) => res.json({ msg: 'só codar' }));
routes.post('/users', UserController.store);
routes.post('/token', SessionController.store);

routes.use(AuthMidleware);

routes.put('/users', UserController.update);

export default routes;
