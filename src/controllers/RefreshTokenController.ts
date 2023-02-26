import { Request, Response } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import {
  ACCESS_TOKEN_EXPIRES_IN_SECONDS,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN_SECONDS,
  REFRESH_TOKEN_SECRET
} from '../constants/enviroment';
import RefreshTokenRepository from '../repositories/RefreshTokenRepository';
import { TokenPayload } from '../middlewares/auth';
import getCookieOptions from '../utils/getCookieOptions';
import UserRepository from '../repositories/UserRepository';

class RefreshTokenController {
  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      return res.sendStatus(401);
    }

    try {
      const {
        userId,
      } = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as TokenPayload;

      const token = await RefreshTokenRepository.findOne({
        token: refreshToken,
        userId: userId
      });

      if (!token) {
        return res.sendStatus(401);
      }

      await RefreshTokenRepository.delete(userId);

      const newRefreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN_SECONDS });

      await RefreshTokenRepository.create({
        userId: userId,
        token: newRefreshToken
      });

      const user = await UserRepository.findById(userId);

      const newAccessToken = jwt.sign({
        userId,
        user: user.name,
        email: user.email
      }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN_SECONDS });

      return res.cookie('refreshToken', newRefreshToken, getCookieOptions())
        .json({
          accessToken: newAccessToken
        });
    } catch (e: any) {
      if (e instanceof TokenExpiredError) {
        return res.status(400)
          .json({
            message: 'Confirmation token has expired',
            slug: 'CONFIRMATION_TOKEN_EXPIRED'
          });
      }

      console.error('Unhandled Error', e);
      return res.status(500)
        .json({
          message: `Internal Server Error - ${e?.message}`,
          stack: e?.stack
        });
    }
  }

}

export default new RefreshTokenController();
