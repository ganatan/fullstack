import express from 'express';
import config from '../../../core/config/config.js';

import permissionHandler from '../../../infrastructure/middleware/security/permission-handler.js';

import Repository from '../repositories/profession.repository.js';
import Service from '../services/profession.service.js';
import Controller from '../controllers/profession.controller.js';

const router = express.Router();

const repository = new Repository(config.dbClient);
const service = new Service(repository);
const controller = new Controller(service);

const admin = permissionHandler(['admin']);
const editor = permissionHandler(['admin', 'editor']);

router
  .route('/')
  .get(editor, controller.getItems)
  .post(admin, controller.createItem);

router
  .route('/:id')
  .get(editor, controller.getItemById)
  .put(admin, controller.updateItem)
  .delete(admin, controller.deleteItem);

export default router;


// import express from 'express';

// import config from '../../core/config/config.js';

// import permissionHandler from '../../infrastructure/middleware/security/permission-handler.js';

// import Repository from './profession.repository.js';
// import Service from './profession.service.js';
// import Controller from './profession.controller.js';

// const router = express.Router();

// const repository = new Repository(config.dbClient);
// const service = new Service(repository);
// const controller = new Controller(service);

// router.get('/', permissionHandler(['admin', 'editor']), controller.getItems);
// router.get('/:id', permissionHandler(['admin', 'editor']), controller.getItemById);
// router.post('/', permissionHandler(['admin']), controller.createItem);
// router.put('/:id', permissionHandler(['admin']), controller.updateItem);
// router.delete('/:id', permissionHandler(['admin']), controller.deleteItem);

// export default router;
