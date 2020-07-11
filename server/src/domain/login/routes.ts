import { json } from 'body-parser';
import { createHash } from 'crypto';
import { Request, Response, Router } from 'express';
import { errorHandler } from '../../utils/express';

export default (
  env: {
    email: string,
    passwordSha256: string
  }
) => {

  const login = (request: Request, response: Response) => {
    const { email, password } = request.body;
    const passwordSha256 = createHash('sha256').update(password, 'utf8').digest('hex').toUpperCase();
    if (env.email !== email || env.passwordSha256 !== passwordSha256) return response.sendStatus(401);
    response.sendStatus(204);
  };

  return Router()
    .use(json())
    .post('/', login)
    .use(errorHandler);
};