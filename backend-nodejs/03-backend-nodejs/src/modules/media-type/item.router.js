import express from 'express';
import config from '../../core/config/config.js';

import Repository from './item.repository.js';
import BaseService from '../../shared/generic/base.service.js';
import BaseController from '../../shared/generic/base.controller.js';

import { ITEM_CONSTANTS } from './item.constant.js';
import { validateItem } from './item.schema.js';

const router = express.Router();

const repository = new Repository(config.dbClient);
const service = new BaseService(repository, ITEM_CONSTANTS);
const controller = new BaseController(service, ITEM_CONSTANTS, { validateItem });

router.get('/', controller.getItems);
router.get('/:id', controller.getItemById);
router.post('/', controller.createItem);
router.put('/:id', controller.updateItem);
router.delete('/:id', controller.deleteItem);

export default router;
