import { S3 } from 'aws-sdk';

export interface FileUploadService {
  (key: string, contents: any): Promise<void>
}

export const inMemoryFileUploadService = (
  onUpload?: (key: string, contents: any) => void
): FileUploadService =>
  async (key: string, contents: any) => {
    if (onUpload) onUpload(key, contents);
  };

export const s3FileUploadService = (
  s3: S3,
  string: string,
): FileUploadService =>
  async (key: string, contents: any) =>
    s3.upload({ Bucket: string, Key: key, Body: contents, ACL: 'public-read' })
      .promise()
      .then(data => console.log(data));