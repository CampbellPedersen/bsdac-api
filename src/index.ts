import express from 'express';
import rapApi from './domain/rap/api';

express()
  .use('rap', rapApi)
  .listen(8080);