import jwt from 'jsonwebtoken';
import { CONFIRMATION_TOKEN_SECRET } from '../constants/enviroment';
import ConfirmationTokenRepository from '../repositories/ConfirmationTokenRepository';

class ConfirmationTokenService {
  async create({
    userId
  }: { userId: string }) {
    const confirmationToken = jwt.sign({
      userId
    }, CONFIRMATION_TOKEN_SECRET, { expiresIn: '10m' });

    await ConfirmationTokenRepository.create({
      token: confirmationToken,
      userId
    });
  }
}

export default new ConfirmationTokenService();
