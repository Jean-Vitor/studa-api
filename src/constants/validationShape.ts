import * as Yup from 'yup';
import { ObjectShape } from 'yup';
import { EMAIL_REGEX, PASSWORD_REGEX } from './regex';

export const USER_SHAPE: ObjectShape = {
  name: Yup.string()
    .required('O nome é obrigatório.'),
  email: Yup.string()
    .required('O e-mail é obrigatório.')
    .matches(EMAIL_REGEX, 'Digite um e-mail válido.'),
  password: Yup.string()
    .required('A senha é obrigatória.')
    .min(8, 'A senha deve ter no mínimo 8 caracteres.')
    .matches(PASSWORD_REGEX,
      'A senha deve conter pelo menos 1 letra maiúscula, 1 número e 1 caracter especial (!@#$%^&*).'
    ),
};
