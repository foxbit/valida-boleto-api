import express, { Express, Router } from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import BoletoService from '../src/boleto/boleto.service';
import { HttpException } from '../src/utils/exceptions';
import HttpStatus from '../src/utils/httpStatus';
import { validateApiKey, rateLimiter } from './middleware/auth';

const api: Express = express();
const router: Router = Router();
const boletoService = new BoletoService();

// Middleware
api.use(cors());
api.use(express.json());
api.use('/.netlify/functions/api', router);

// API Key validation for all routes
router.use(validateApiKey);
router.use(rateLimiter);

// Routes
router.get('/', (req, res) => {
  res.json({
    title: "Bank Slip Validator API",
    message: "API para consultar linhas digitáveis de boleto de título bancário e pagamento de concessionárias.",
    version: "1.0.0"
  });
});

router.get('/boleto/:codigo', (req, res) => {
  try {
    const { status, data } = boletoService.parse(req.params.codigo);
    return res.status(status).json(data);
  }
  catch (error) {
    if (error instanceof HttpException) {
      return res.status(error.status).json({
        status: error.status,
        message: error.message
      });
    }
    return res.status(HttpStatus.INTERNAL_ERROR).json({
      status: HttpStatus.INTERNAL_ERROR,
      message: 'Internal server error'
    });
  }
});

// Error handling
router.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: "Not Found"
  });
});

export const handler = serverless(api);
