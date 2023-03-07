import jwt from 'jsonwebtoken';
import { CONFIRMATION_TOKEN_SECRET } from '../constants/enviroment';
import ConfirmationTokenRepository from '../repositories/ConfirmationTokenRepository';
import EmailWorker from '../workers/EmailWorker';
import UserRepository from '../repositories/UserRepository';
import { TemplateKey } from '../templates';

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

    const { email, name } = await UserRepository.findById(userId);

    await EmailWorker.sendEmail(email, 'Por favor, confirme sua conta', TemplateKey.CONFIRMATION_TOKEN, {
      title: 'Código de confirmação',
      token: confirmationToken,
      message: `Oi ${name.split(' ')[0]}, falta pouco para que você possa usar o Studa. Mas antes disso precisamos que você confirme sua conta.`
    });
  }
}

export default new ConfirmationTokenService();
