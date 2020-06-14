import express from 'express';
import rapApi from './domain/rap/api';

console.log('Listening on port 80...');
express()
  .use('/raps', rapApi())
  .listen(80);