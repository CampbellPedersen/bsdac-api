import { DynamoDB } from 'aws-sdk';
import express from 'express';
import rapApi from './domain/rap/routes';
import { dynamodbRapository } from './domain/rap/repository';
import { inMemoryRapAudioUrlService } from './domain/rap/audio-url-service';

const env = {
  port: process.env.SERVICE_PORT || '8080',
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  },
  dynamodb: {
    endpoint: process.env.DYNAMODB_ENDPOINT
  }
};

const dynamodb = new DynamoDB.DocumentClient({ region: env.aws.region, endpoint: env.dynamodb.endpoint });
const rapRepository = dynamodbRapository(dynamodb);
const rapAudioUrlService = inMemoryRapAudioUrlService();

console.log(`Listening on port: ${env.port}`);

express()
  .use('/raps', rapApi(rapRepository, rapAudioUrlService))
  .listen(80);