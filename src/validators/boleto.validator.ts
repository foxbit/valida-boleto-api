import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const boletoSchema = z.object({
  codigo: z.string()
    .regex(/^\d+$/, 'O código deve conter apenas números')
    .refine((val: string) => val.length === 47 || val.length === 48, {
      message: 'O código deve ter 47 ou 48 dígitos'
    })
});

export const validateBatchRequest = (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = z.object({
      codes: z.array(z.string())
        .min(1, 'Envie pelo menos um código')
        .max(100, 'Máximo de 100 códigos por requisição')
    });

    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        status: 'error',
        message: error.errors[0].message
      });
    } else {
      next(error);
    }
  }
};
