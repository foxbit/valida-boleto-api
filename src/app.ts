import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import config from './config';
import appController from './app.controller';
import boletoController from './boleto/boleto.controller';
import middleware from './middleware';

dotenv.config();
const app: Express = express();

// app setup
app.disable('x-powered-by');
app.use(express.json());
app.use(cors());

// swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// controllers
app.use('/', appController);
app.use('/boleto', boletoController);

// middlewares
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

// listening to requests
app.listen(config.app.port, () => {
  console.log(`\n[server]: Server running at ${config.app.host}:${config.app.port} 🤙\n`);
  console.log(`[docs]: API documentation available at ${config.app.host}:${config.app.port}/api-docs\n`);
});
