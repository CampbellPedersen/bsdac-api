import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Rap } from './repository';

export interface RapAudioUrlService {
  (rap: Rap): Promise<string>
}

export const inMemoryRapAudioUrlService = (): RapAudioUrlService =>
  async (rap) => {
    return `https://local.raps/${rap.id}`;
  };

export const s3RapAudioUrlService = (
  s3: S3Client,
  bucketName: string,
): RapAudioUrlService =>
  async (rap) => getSignedUrl(s3, new GetObjectCommand({
    Bucket: bucketName,
    Key: rap.id,
  }), {
    expiresIn: 60 * 60, // 1 hour
  });
