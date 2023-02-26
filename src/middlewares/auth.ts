import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../constants/enviroment';

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

export default function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Incorrect token type', slug: 'INCORRECT_TOKEN_TYPE' });
  }

  if (!authorization) {
    return res.status(401).json({ message: 'Unauthorized', slug: 'UNAUTHORIZED' });
  }

  const token = authorization.replace('Bearer', '').trim();

  try {
    const data = jwt.verify(token, ACCESS_TOKEN_SECRET);

    const { userId } = data as TokenPayload;

    req.userId = userId;

    return next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized', slug: 'UNAUTHORIZED' });
  }
}
