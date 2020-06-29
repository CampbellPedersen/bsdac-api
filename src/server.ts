import AWS, { DynamoDB, S3 } from 'aws-sdk';
import express from 'express';
import { inMemoryRapAudioUrlService } from './domain/rap/audio-url-service';
import { dynamodbRapository } from './domain/rap/repository';
import rapApi from './domain/rap/routes';
import { s3FileUploadService } from './utils/file';

const env = {
  port: process.env.SERVICE_PORT || '8080',
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  },
  dynamodb: {
    endpoint: process.env.DYNAMODB_ENDPOINT,
  },
  s3: {
    bucketName: process.env.S3_BUCKET_NAME,
    endpoint: process.env.S3_ENDPOINT,
  }
};

AWS.config.update(env.aws);
const dynamodb = new DynamoDB.DocumentClient(env.dynamodb);
const repository = dynamodbRapository(dynamodb);
const s3 = new S3({ ...env.s3, s3ForcePathStyle: true });
const uploadService = s3FileUploadService(s3, env.s3.bucketName);
const audioUrlService = inMemoryRapAudioUrlService();

console.log(`Listening on port: ${env.port}`);

express()
  .use('/raps', rapApi(repository, uploadService, audioUrlService))
  .listen(env.port);