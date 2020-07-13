import { S3 } from 'aws-sdk';
import { Rap } from './repository';

export interface RapAudioUrlService {
  (rap: Rap): Promise<string>
}

export const inMemoryRapAudioUrlService = (): RapAudioUrlService =>
  async (rap) => {
    return `https://local.raps/${rap.id}`;
  };

export const s3RapAudioUrlService = (
  s3: S3,
  bucketName: string,
): RapAudioUrlService =>
  async (rap) => s3.getSignedUrl('getObject', {
    Bucket: bucketName,
    Key: rap.id,
    Expires: 60 * 60, // 1 hour
  });