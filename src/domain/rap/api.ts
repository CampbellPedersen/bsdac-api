import { inMemoryRapository } from './repository';
import rapRoutes from './routes';
import { inMemoryRapAudioUrlService } from './audio-url-service';

export default () => {
  const repository = inMemoryRapository();
  const streamUrlBuilder = inMemoryRapAudioUrlService();
  return rapRoutes(repository, streamUrlBuilder);
};