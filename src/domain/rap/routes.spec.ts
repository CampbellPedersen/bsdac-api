import express from 'express';
import request from 'supertest';
import { rapRouter } from './routes';
import { inMemoryRapository, Rap } from './repository';

const rap = {
  id: 'rap-001',
  title: 'The First Rap',
  bonus: false,
  rapper: 'Campbell Pedersen',
  imageUrl: 'https://imgur.com/theFirstRap',
  appearedAt: { name: 'Big Smash Day and Cube', series: 1 },
};

const audioUrl = 'https://vgmdownloads.com/soundtracks/super-mario-64-soundtrack/zfvgdumr/18%20File%20Select.mp3';
const urlBuilder = (onReceiveParams?: (params: Rap) => void) =>
  async (rap: Rap) => {
    if (onReceiveParams) onReceiveParams(rap);
    return audioUrl;
  };

describe('routes > /', () => {
  const repository = inMemoryRapository();
  const app = express().use('/raps', rapRouter(repository, urlBuilder()));

  it('given no raps > then returns empty array of raps and http 200', async () => {
    await request(app)
      .get('/raps')
      .expect(200, []);
  });

  it('given rap > returns array of raps and http 200', async () => {
    await repository.save(rap);

    await request(app)
      .get('/raps')
      .expect(200, [ rap ]);
  });
});

describe('routes > /stream/:id', () => {
  let urlBuilderParams: Rap | undefined;
  const repository = inMemoryRapository();
  const app = express().use('/raps', rapRouter(repository, urlBuilder(params => urlBuilderParams = params)));

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