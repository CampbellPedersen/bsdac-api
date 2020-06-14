import { Pool } from 'pg';

export const getDbConnection = (config: { host: string, name: string, user: string, password: string, port: string, sslCertificate?: string }) => new Pool({
  connectionTimeoutMillis: 30000,
  max: 20,
  host: config.host,
  database: config.name,
  user: config.user,
  password: config.password,
  port: Number.parseInt(config.port),
  ssl: config.sslCertificate ? { cert: config.sslCertificate } : false,
}).on('error', (error: Error) => {
  // tslint:disable-next-line: no-console
  console.log('Error on idle client', error.message);
});

export const getTestDbConnection = () => getDbConnection({ host: 'localhost', name: 'postgres', user: 'postgres', password: 'postgres', port: '5432' });