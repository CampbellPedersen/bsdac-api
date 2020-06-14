import { getTestDbConnection } from './utils/db';

export default async () => {
  const pool = getTestDbConnection();
  await pool.query('CREATE SCHEMA IF NOT EXISTS bsdac_api');
  await pool.query(`
    CREATE TABLE bsdac_api.raps (
      id                    TEXT PRIMARY KEY,
      title                 TEXT NOT NULL,
      rapper                TEXT NOT NULL,
      bonus                 BOOLEAN NOT NULL,
      image_url             TEXT NOT NULL,
      event_name            TEXT NOT NULL,  
      event_series          BIGINT NOT NULL
    );`);
  pool.end();
};