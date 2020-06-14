import { inMemoryRapAudioUrlService, RapAudioUrlService } from './audio-url-service';
import { EventName } from './repository';

const rap = {
  id: 'rap-001',
  title: 'The First Rap',
  bonus: false,
  rapper: 'Campbell Pedersen',
  imageUrl: 'https://imgur.com/theFirstRap',
  appearedAt: { name: EventName.BSDAC, series: 1 },
};

const baseTests = (getRapAudioUrl: RapAudioUrlService) => () => {
  it('generates rap url', async () => {
    const url = await getRapAudioUrl(rap);
    expect(url).toBeTruthy();
  });
};

const inMemory = inMemoryRapAudioUrlService();
describe('in-memory-rap-audio-url-service', baseTests(inMemory));