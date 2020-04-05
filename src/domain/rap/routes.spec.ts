import express from 'express';
import request from 'supertest';
import { rapRouter } from './routes';
import { inMemoryRapository } from './repository';

const rap = {
  id: 'rap-001',
  title: 'The First Rap',
  rapper: 'Campbell Pedersen',
  imageUrl: 'https://imgur.com/theFirstRap',
  appearedAt: { event: 'bsdac', series: 1 },
};

describe('raps-routes', () => {
  const repository = inMemoryRapository();
  const app = express().use('/raps', rapRouter(repository));

  it('returns empty array of raps and http 200', async () => {
    await request(app)
      .get('/raps')
      .expect(200, []);
  });

  it('returns no rap and http 404', async () => {
    await request(app)
      .get(`/raps/${rap.id}`)
      .expect(404);
  });

  it('returns one rap and http 200', async () => {
    await repository.save(rap);

    await request(app)
      .get(`/raps/${rap.id}`)
      .expect(200, rap);
  });

  it('returns array of raps and http 200', async () => {
    await request(app)
      .get('/raps')
      .expect(200, [ rap ]);
  });
});