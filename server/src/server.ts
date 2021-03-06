import AWS, { DynamoDB, S3 } from 'aws-sdk';
import express from 'express';

import { s3RapAudioUrlService } from './domain/rap/audio-url-service';
import { dynamodbRapository } from './domain/rap/repository';
import { s3FileUploadService } from './utils/file';
import { health } from './utils/health';

import loginApi from './domain/login/routes';
import rapApi from './domain/rap/routes';

const env = {
  port: process.env.SERVICE_PORT || '8080',
  login: {
    email: process.env.LOGIN_EMAIL,
    passwordSha256: process.env.LOGIN_PASSWORD_SHA256
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  },
  dynamodb: {
    endpoint: process.env.DYNAMODB_ENDPOINT,
    tableName: process.env.DYNAMODB_TABLE_NAME,
  },
  s3: {
    bucketName: process.env.S3_BUCKET_NAME,
    endpoint: process.env.S3_ENDPOINT,
  }
};

AWS.config.update(env.aws);
const dynamodb = new DynamoDB.DocumentClient({ endpoint: env.dynamodb.endpoint });
const repository = dynamodbRapository(dynamodb, env.dynamodb.tableName);
const s3 = new S3({ ...env.s3, signatureVersion: 'v4', s3ForcePathStyle: true });
const uploadService = s3FileUploadService(s3, env.s3.bucketName);
const audioUrlService = s3RapAudioUrlService(s3, env.s3.bucketName);

console.log(`Listening on port: ${env.port}`);

express()
  .use('/healthz', health)
  .use('/api/login', loginApi(env.login))
  .use('/api/raps', rapApi(repository, uploadService, audioUrlService))
  .listen(env.port);