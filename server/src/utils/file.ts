import { S3 } from 'aws-sdk';

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
  s3: S3,
  bucketName: string,
): FileUploadService =>
  async (key: string, mimetype: string, contents: any) =>
    s3.upload({ Bucket: bucketName, Key: key, Body: contents, ContentType: mimetype, ACL: 'public-read'})
      .promise()
      .then(() => undefined)
      .catch(e => { throw e; });