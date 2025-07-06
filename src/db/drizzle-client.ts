import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as Database from 'better-sqlite3';
import * as schema from './schema';

export const DrizzleDatabase = 'DRIZZLE_DB';

const sqlite = new Database('./db.sqlite');
export const db = drizzle(sqlite, {
  schema: schema,
  logger: true,
});

export type DatabaseClient = typeof db;
