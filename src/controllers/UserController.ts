import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import UserRepository from '../repositories/UserRepository';
import jwt from 'jsonwebtoken';
import { CONFIRMATION_TOKEN_SECRET } from '../constants/enviroment';
import ConfirmationTokenRepository from '../repositories/ConfirmationTokenRepository';
import { TokenPayload } from '../middlewares/auth';
import ConfirmationTokenService from '../services/ConfirmationTokenService';

class UserController {
  async register(req: Request, res: Response) {
    const {
      name,
      email,
      password
    } = req.body;

    try {
      const userAlreadyExists = await UserRepository.findByEmail(email);

      if (userAlreadyExists) {
        return res.status(409)
          .json({
            message: 'This e-mail is already in use',
            slug: 'EMAIL_ALREADY_IN_USE'
          });
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const user = await UserRepository.create({
        name,
        email,
        password: hash
      });

      await ConfirmationTokenService.create({
        userId: user.id
      });

      return res.sendStatus(201);
    } catch (e: unknown) {
      console.error(e);
      return res.status(500)
        .json(e);
    }
  }

  async confirm(req: Request, res: Response) {
    const {
      confirmationToken
    } = req.body;

    try {

      const {
        exp
      } = jwt.decode(confirmationToken) as TokenPayload;

      const now = Date.now() / 1000;

      if (exp < now) {
        const {
          userId
        } = jwt.verify(confirmationToken, CONFIRMATION_TOKEN_SECRET, {ignoreExpiration: true}) as TokenPayload;

        console.log(userId);

        await ConfirmationTokenRepository.delete(userId);

        await ConfirmationTokenService.create({
          userId
        })

        return res.status(202)
          .json({
            message: 'Your code has expired, but has been recreated and sent by email.',
            slug: 'TOKEN_EXPIRED_AND_RECREATED'
          });
      }

      const {
        userId
      } = jwt.verify(confirmationToken, CONFIRMATION_TOKEN_SECRET) as TokenPayload;

      const token = await ConfirmationTokenRepository.findOne({
        token: confirmationToken,
        userId: userId
      });

      if (!token) {
        return res.sendStatus(400);
      }

      await ConfirmationTokenRepository.delete(userId);

      await UserRepository.activate(userId);

      return res.sendStatus(200);
    } catch (e: any) {
      console.error('Unhandled Error', e);
      return res.status(500)
        .json({
          message: `Internal Server Error - ${e?.message}`,
          stack: e?.stack
        });
    }
  }
}

export default new UserController();
