import * as crypto from 'crypto';
import { CONFIRMATION_TOKEN_SECRET } from '../constants/enviroment';

function generateConfirmationCode(userId: string) {
  return crypto.createHmac('sha256', CONFIRMATION_TOKEN_SECRET).update(userId.toString()).digest('hex');
}

export default generateConfirmationCode;
