import { getTestDbConnection } from './utils/db';

export default async () => {
  const pool = getTestDbConnection();
  await pool.query('DROP TABLE bsdac_api.raps');
  pool.end();
};