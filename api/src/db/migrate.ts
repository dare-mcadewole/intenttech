/**
 * Applies api/drizzle/init.sql (idempotent DDL) using node-postgres directly.
 * Run: pnpm db:migrate (from root) with DATABASE_URL set.
 * drizzle-kit remains available for future diff-based migrations (db:generate).
 */
import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Pool } from 'pg';

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const file = join(__dirname, '..', '..', 'drizzle', 'init.sql');
  const sql = await readFile(file, 'utf8');
  await pool.query(sql);
  await pool.end();
  // eslint-disable-next-line no-console
  console.log('Database migrated (drizzle/init.sql applied).');
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
