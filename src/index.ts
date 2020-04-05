import express from 'express';
import rapApi from './domain/rap/api';

express()
  .use('raps', rapApi)
  .listen(8080);