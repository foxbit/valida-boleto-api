import { Router } from 'express';
import { BoletoService } from '../services/boleto.service';

const router = Router();
const boletoService = new BoletoService();

router.get('/:code', (req, res) => {
  try {
    const result = boletoService.parse(req.params.code);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      error: {
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    });
  }
});

export default router;
