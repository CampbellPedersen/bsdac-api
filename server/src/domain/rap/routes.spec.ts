import express from 'express';
import request from 'supertest';
import rapRoutes from './routes';
import { inMemoryRapository, Rap, EventName } from './repository';
import { inMemoryFileUploadService } from '../../utils/file';

const details = { title: 'The Rap', lyrics: 'Words words words', bonus: false, rapper: 'Campbell Pedersen', imageUrl: 'https://imgur.com/theRap', appearedAt: { name: EventName.BSDAC, series: 1 } };
const audioUrl = 'https://vgmdownloads.com/soundtracks/super-mario-64-soundtrack/zfvgdumr/18%20File%20Select.mp3';
const urlBuilder = (onReceiveParams?: (params: Rap) => void) => async (rap: Rap) => { if (onReceiveParams) onReceiveParams(rap); return audioUrl; };

describe('/get-all', () => {
  const repository = inMemoryRapository();
  const upload = inMemoryFileUploadService();
  const app = express()
    .use('/raps', rapRoutes(repository, upload, urlBuilder()));

  it('given no raps > then returns empty array of raps and http 200', async () => {
    await request(app)
      .get('/raps/get-all')
      .expect(200, []);
  });

  it('given rap > returns array of raps and http 200', async () => {
    const rap = { ...details, id: 'rap-001' };
    await repository.save(rap);

    await request(app)
      .get('/raps/get-all')
      .expect(200, [ rap ]);
  });
});

describe('/save', () => {
  const generatedRapId = 'rap-002';
  const repository = inMemoryRapository();
  const upload = inMemoryFileUploadService();
  const app = express()
    .use('/raps', rapRoutes(repository, upload, urlBuilder(), () => generatedRapId));

  test.each(['title', 'rapper', 'bonus', 'imageUrl', 'appearedAt'])
  ('when request is missing %s > then returns 400', async (missingProperty) => {
    const body: any = { ...details };
    delete(body[missingProperty]);
    await request(app)
      .post('/raps/save')
      .attach('file', './package.json')
      .field('details', JSON.stringify(body))
      .expect(400);
  });

  test.each(['name', 'series'])
  ('when request is missing event %s > then returns 400', async (missingProperty: 'name' | 'series') => {
    const appearedAt = { ...details.appearedAt };
    delete(appearedAt[missingProperty]);
    const body: any = { ...details, appearedAt };
    await request(app)
      .post('/raps/save')
      .attach('file', './package.json')
      .field('details', JSON.stringify(body))
      .expect(400);
  });

  it('when request > then saves rap and returns http 201', async () => {
    await request(app)
      .post('/raps/save')
      .attach('file', './package.json')
      .field('details', JSON.stringify(details))
      .expect(201)
      .expect({ id: generatedRapId, ...details});

    const savedRap = await repository.load(generatedRapId);
    expect(savedRap).toEqual({ id: generatedRapId, ...details });
  });
});

describe('/stream/:id', () => {
  let urlBuilderParams: Rap | undefined;
  const repository = inMemoryRapository();
  const upload = inMemoryFileUploadService();
  const app = express()
    .use('/raps', rapRoutes(repository, upload, urlBuilder(params => urlBuilderParams = params)));

  beforeEach(() => urlBuilderParams = undefined);

  it('given no rap > then http 404', async () => {
    await request(app)
      .get('/raps/stream/rap-001')
      .expect(404)
      .then(() => {
        expect(urlBuilderParams).toBeUndefined();
      });
  });

  it('given rap > then returns rap url and http 200', async () => {
    const rap = { ...details, id: 'rap-001' };
    await repository.save(rap);

    await request(app)
      .get('/raps/stream/rap-001')
      .expect(200, audioUrl)
      .then(() => {
        expect(urlBuilderParams).toEqual(rap);
      });
  });
});
