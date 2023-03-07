import { Client } from 'pg';
import { DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from '../../constants/enviroment';

const client = new Client({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: 'studa',
});

client.connect();

export async function query(query: string, values: any) {
  const { rows } = await client.query(query, values);
  return rows;
}
