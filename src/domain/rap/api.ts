import { inMemoryRapository } from './repository';
import { rapRouter } from './routes';
import { inMemoryRapAudioUrlService } from './audio-url-service';

export default () => {
  const repository = inMemoryRapository();
  const streamUrlBuilder = inMemoryRapAudioUrlService();
  return rapRouter(repository, streamUrlBuilder);
};