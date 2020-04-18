import { Rap } from './repository';

export interface StreamUrlBuilder {
  (rap: Rap): Promise<string>
}