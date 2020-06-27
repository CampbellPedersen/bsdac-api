import AWS, { DynamoDB } from 'aws-sdk';
import express from 'express';
import { inMemoryRapAudioUrlService } from './domain/rap/audio-url-service';
import { dynamodbRapository } from './domain/rap/repository';
import rapApi from './domain/rap/routes';
import { inMemoryFileUploadService } from './utils/file';

const env = {
  port: process.env.SERVICE_PORT || '8080',
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  },
  dynamodb: {
    endpoint: process.env.DYNAMODB_ENDPOINT
  },
  s3: {
    bucketName: process.env.S3_BUCKET_NAME,
  }
};

AWS.config.update(env.aws);
const dynamodb = new DynamoDB.DocumentClient({ endpoint: env.dynamodb.endpoint });
const repository = dynamodbRapository(dynamodb);
const uploadService = inMemoryFileUploadService();
const audioUrlService = inMemoryRapAudioUrlService();

console.log(`Listening on port: ${env.port}`);

express()
  .use('/raps', rapApi(repository, uploadService, audioUrlService))
  .listen(env.port);