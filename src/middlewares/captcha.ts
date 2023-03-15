import axios from 'axios';
import { NextFunction, Request, Response } from 'express';

export default async function CaptchaMiddleware(req: Request, res: Response, next: NextFunction) {
  const captchaResponse = req.body['g-recaptcha-response'];
  // TODO criar a secret a colocar na .env
  const secretKey = 'sua-chave-secreta-aqui';

  try {
    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret: secretKey,
        response: captchaResponse,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { data } = response;

    if (data.success) {
      next();
    } else {
      res.status(403).send('Falha no reCAPTCHA');
    }
  } catch (error) {
    console.error('Erro ao validar reCAPTCHA:', error);
    res.status(500).send('Erro interno do servidor');
  }
}
