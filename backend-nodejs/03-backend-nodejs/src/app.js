import express from 'express';
import cors from 'cors';

import modulesRouter from './routers/modules.router.js';
import rootRouter from './routers/root.router.js';

import responseHandler from './infrastructure/middleware/response-handler.js';
import errorHandler from './infrastructure/middleware/error-handler.js';
import notFoundHandler from './infrastructure/middleware/not-found-handler.js';

import swaggerRouter from './infrastructure/swagger/swagger.router.js';

import requestLogger from './infrastructure/logger/request-logger.js';
import errorLogger from './infrastructure/logger/error-logger.js';

const app = express();

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
  res.locals = res.locals || {};
  next();
});

app.use(requestLogger);

app.use('/api-docs', swaggerRouter);
app.use(rootRouter);
app.use(modulesRouter);

app.use(notFoundHandler);
app.use(responseHandler);
app.use(errorLogger);
app.use(errorHandler);

export default app;
