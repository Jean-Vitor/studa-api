import { NODE_ENV } from '../constants/enviroment';
import { CookieOptions } from 'express';

export default function () {
  return {
    httpOnly: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    secure: NODE_ENV === 'production',
  } as CookieOptions;
}
