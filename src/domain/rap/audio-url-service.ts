import { Rap } from './repository';

export interface RapAudioUrlService {
  (rap: Rap): Promise<string>
}

export const inMemoryRapAudioUrlService = (): RapAudioUrlService =>
  async (rap) => {
    return `https://local.raps/${rap.id}`;
  };