import { NextFunction, Request, Response } from 'express';
import * as Yup from 'yup';

export default function ValidateMiddleware(shape: Yup.ObjectShape) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;

    const schema = Yup.object().shape(shape);

    try {
      await schema.validate(body);
      next();
    } catch (e: any) {
      if (e instanceof Yup.ValidationError) {
        res.status(400)
          .json({
            message: e.message,
            slug: 'VALIDATION_ERROR'
          });
      }

      console.error('Unhandled Error', e);
      res.status(500)
        .json({
          message: `Internal Server Error - ${e?.message}`,
          stack: e?.stack
        });
    }
  };
}
