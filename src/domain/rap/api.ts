import { inMemoryRapository } from './repository';
import { rapRouter } from './routes';

export default () => {
  const repository = inMemoryRapository();
  return rapRouter(repository);
};