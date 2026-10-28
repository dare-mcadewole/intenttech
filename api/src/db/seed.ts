/**
 * Bootstrap seed: creates the first ADMIN account from env vars.
 * Disable/remove after first login in production.
 * Run: BOOTSTRAP_ADMIN_EMAIL=... BOOTSTRAP_ADMIN_PASSWORD=... pnpm db:seed
 */
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { authUsers } from './schema';

async function main() {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL;
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  if (!email || !password) {
    // eslint-disable-next-line no-console
    console.log('BOOTSTRAP_ADMIN_EMAIL/PASSWORD not set — skipping seed.');
    return;
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema: { authUsers } });
  const existing = await db.select().from(authUsers);
  if (existing.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    // eslint-disable-next-line no-console
    console.log(`Admin ${email} already exists — skipping.`);
    await pool.end();
    return;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await db.insert(authUsers).values({ email, passwordHash, role: 'ADMIN' });
  // eslint-disable-next-line no-console
  console.log(`Bootstrapped ADMIN ${email}.`);
  await pool.end();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
