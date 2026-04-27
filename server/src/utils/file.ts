import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export interface FileUploadService {
  (key: string, mimetype: string, contents: any): Promise<void>
}

export const inMemoryFileUploadService = (
  onUpload?: (key: string, mimetype: string, contents: any) => void
): FileUploadService =>
  async (key: string, mimetype: string, contents: any) => {
    if (onUpload) onUpload(key, mimetype, contents);
  };

export const s3FileUploadService = (
  s3: S3Client,
  bucketName: string,
): FileUploadService =>
  async (key: string, mimetype: string, contents: any) => {
    await s3.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: contents,
      ContentType: mimetype,
      ACL: 'public-read',
    }));
  };
