import express from 'express';

import responseHandler from '../../middlewares/response-handler.js';

import Repository from './person.repository.js';
import Service from './person.service.js';
import Controller from './person.controller.js';

import config from '../../core/config/config.js';

const router = express.Router();

const repository = new Repository(config.useDatabase);
const service = new Service(repository);
const controller = new Controller(service);

router.get('/', controller.getItems, responseHandler);
router.get('/:id', controller.getItemById, responseHandler);
router.post('/', controller.createItem, responseHandler);
router.put('/:id', controller.updateItem, responseHandler);
router.delete('/:id', controller.deleteItem, responseHandler);

export default router;
