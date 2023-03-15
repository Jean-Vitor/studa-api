import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import UserRepository from '../repositories/UserRepository';
import ConfirmationTokenRepository from '../repositories/ConfirmationTokenRepository';
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
      confirmationCode
    } = req.body;

    try {

      const token = await ConfirmationTokenRepository.findOne({ token: confirmationCode });

      if (!token) {
        return res.sendStatus(400);
      }

      const { user_id } = token;

      //TODO verificar a expiração do token - 10 minutos

      await ConfirmationTokenRepository.delete(user_id);

      await UserRepository.activate(user_id);

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
