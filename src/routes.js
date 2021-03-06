import { Router } from 'express';
import multer from 'multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import SubscriptionController from './app/controllers/SubscriptionController';
import AuthMidleware from './app/midlewares/auth';

import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/', (req, res) => res.json({ msg: 'só codar' }));
routes.post('/users', UserController.store);
routes.post('/token', SessionController.store);

routes.use(AuthMidleware);

routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/meetups', MeetupController.store);
routes.put('/meetups/:id', MeetupController.update);
routes.get('/meetups', MeetupController.index);
routes.delete('/meetups/:id', MeetupController.delete);

routes.post('/subscriptions', SubscriptionController.store);
routes.get('/subscriptions', SubscriptionController.index);

export default routes;
