import express from 'express';
import request from 'supertest';
import rapRoutes from './routes';
import { inMemoryRapository, Rap, EventName } from './repository';

describe('routes', () => {
  const rap = {
    id: 'rap-001',
    title: 'The Rap',
    bonus: false,
    rapper: 'Campbell Pedersen',
    imageUrl: 'https://imgur.com/theRap',
    appearedAt: { name: EventName.BSDAC, series: 1 },
  };

  const audioUrl = 'https://vgmdownloads.com/soundtracks/super-mario-64-soundtrack/zfvgdumr/18%20File%20Select.mp3';
  const urlBuilder = (onReceiveParams?: (params: Rap) => void) =>
    async (rap: Rap) => {
      if (onReceiveParams) onReceiveParams(rap);
      return audioUrl;
    };

  describe('/get-all', () => {
    const repository = inMemoryRapository();
    const app = express().use('/raps', rapRoutes(repository, urlBuilder()));

    it('given no raps > then returns empty array of raps and http 200', async () => {
      await request(app)
        .get('/raps/get-all')
        .expect(200, []);
    });

    it('given rap > returns array of raps and http 200', async () => {
      await repository.save(rap);

      await request(app)
        .get('/raps/get-all')
        .expect(200, [ rap ]);
    });
  });

  describe('/save', () => {
    const generatedRapId = 'rap-002';
    const repository = inMemoryRapository();
    const app = express().use('/raps', rapRoutes(repository, urlBuilder(), () => generatedRapId));

    it('when request > then saves rap and returns http 201', async () => {
      await request(app)
        .post('/raps/save')
        .send(rap)
        .expect(201);

      const savedRap = await repository.load(rap.id);
      expect(savedRap).toEqual(rap);
    });

    it('when request has no id > then saves rap and returns http 201', async () => {
      await request(app)
        .post('/raps/save')
        .send({ ...rap, id: undefined })
        .expect(201);

      const savedRap = await repository.load(generatedRapId);
      expect(savedRap).toEqual({ ...rap, id: generatedRapId });
    });
  });

  describe('/stream/:id', () => {
    let urlBuilderParams: Rap | undefined;
    const repository = inMemoryRapository();
    const app = express().use('/raps', rapRoutes(repository, urlBuilder(params => urlBuilderParams = params)));

    beforeEach(() => urlBuilderParams = undefined);

    it('given no rap > then http 404', async () => {
      await request(app)
        .get(`/raps/stream/${rap.id}`)
        .expect(404)
        .then(() => {
          expect(urlBuilderParams).toBeUndefined();
        });
    });

    it('given rap > then returns rap url and http 200', async () => {
      await repository.save(rap);

      await request(app)
        .get(`/raps/stream/${rap.id}`)
        .expect(200, audioUrl)
        .then(() => {
          expect(urlBuilderParams).toEqual(rap);
        });
    });
  });
});