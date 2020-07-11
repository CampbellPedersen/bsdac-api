import { json } from 'body-parser';
import express from 'express';
import request from 'supertest';
import loginRoutes from './routes';

describe('/login', () => {
  const app = express()
    .use(json())
    .use('/login', loginRoutes({ email: 'test@bsdac.com', passwordSha256: 'F8989B5A61549C8418A6ECEF30E1EEE6E6E5A5E97450C3AF4DF35130F84EE7C0' }));

  it('when login > then return 204', async () => {
    await request(app)
      .post('/login')
      .send({ email: 'test@bsdac.com', password: 'bsdac' })
      .expect(204);
  });

  it('when login with invalid email > then return 401', async () => {
    await request(app)
      .post('/login')
      .send({ email: 'nah@bsdac.com', password: 'bsdac' })
      .expect(401);
  });

  it('when login with invalid password > then return 401', async () => {
    await request(app)
      .post('/login')
      .send({ email: 'test@bsdac.com', password: 'nah' })
      .expect(401);
  });
});
