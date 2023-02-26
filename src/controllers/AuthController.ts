import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import UserRepository from '../repositories/UserRepository';
import jwt from 'jsonwebtoken';
import {
  ACCESS_TOKEN_EXPIRES_IN_SECONDS,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN_SECONDS,
  REFRESH_TOKEN_SECRET
} from '../constants/enviroment';
import RefreshTokenRepository from '../repositories/RefreshTokenRepository';
import getCookieOptions from '../utils/getCookieOptions';

class AuthController {
  async login(req: Request, res: Response) {
    const {
      email,
      password
    } = req.body;

    try {
      const user = await UserRepository.findByEmail(email);

      if (!user.active) {
        return res.status(409)
          .json({
            message: 'User is not active',
            slug: 'USER_IS_NOT_ACTIVE'
          });
      }

      if (!user) {
        return res.status(401)
          .json({
            message: 'Invalid credentials',
            slug: 'INVALID_CREDENTIALS'
          });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401)
          .json({
            message: 'Invalid credentials',
            slug: 'INVALID_CREDENTIALS'
          });
      }

      const accessToken = jwt.sign({
        userId: user.id,
        email: user.email,
        name: user.name
      }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN_SECONDS });

      const refreshToken = jwt.sign({
        userId: user.id,
      }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN_SECONDS });

      await RefreshTokenRepository.delete(user.id);

      await RefreshTokenRepository.create({
        userId: user.id,
        token: refreshToken
      });

      return res.cookie('refreshToken', refreshToken, getCookieOptions())
        .json({
          user: {
            name: user.name,
            email: user.email
          },
          accessToken
        });
    } catch (e: any) {
      console.error(e);
      return res.status(500)
        .json(e);
    }
  }
}

export default new AuthController();
