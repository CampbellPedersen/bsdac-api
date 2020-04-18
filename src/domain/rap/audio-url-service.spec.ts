import { inMemoryRapAudioUrlService, RapAudioUrlService } from './audio-url-service';

const rap = {
  id: 'rap-001',
  title: 'The First Rap',
  rapper: 'Campbell Pedersen',
  imageUrl: 'https://imgur.com/theFirstRap',
  appearedAt: { name: 'bsdac', series: 1 },
};

const baseTests = (getRapAudioUrl: RapAudioUrlService) => () => {
  it('generates rap url', async () => {
    const url = await getRapAudioUrl(rap);
    expect(url).toBeTruthy();
  });
};

const inMemory = inMemoryRapAudioUrlService();
describe('in-memory-rap-audio-url-service', baseTests(inMemory));