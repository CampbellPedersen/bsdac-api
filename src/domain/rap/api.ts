import { Pool } from 'pg';
import { inMemoryRapAudioUrlService } from './audio-url-service';
import { postgresqlRapository } from './repository';
import rapRoutes from './routes';


export default (pool: Pool) => {
  const repository = postgresqlRapository(pool);
  const streamUrlBuilder = inMemoryRapAudioUrlService();
  return rapRoutes(repository, streamUrlBuilder);
};