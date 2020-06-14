import express from 'express';
import rapApi from './domain/rap/api';
import { getDbConnection } from './utils/db';

const env = {
  port: process.env.SERVICE_PORT as string || '8080',
  db: {
    host: process.env.DB_HOST as string,
    port: process.env.DB_PORT as string,
    name: process.env.DB_NAME as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
  },
};

console.log(process.env.SERVICE_PORT);
const dbConnection = getDbConnection(env.db);

console.log(`Listening on port: ${env.port}`);
express()
  .use('/raps', rapApi(dbConnection))
  .listen(80);