/* eslint-disable no-console */
// Runs after Umami's migrations. If the seeded admin account still has the
// default password "umami", set it to ADMIN_PASSWORD. Does nothing otherwise.
import { createRequire } from 'node:module';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

const require = createRequire('/opt/railway/package.json');
const bcrypt = require('bcryptjs');

// From Umami's seed migration (prisma/migrations/01_init) and src/lib/password.ts.
const SYSTEM_USER_ID = '41e2b680-648e-4b09-bcd7-3e2b10c06264';
const DEFAULT_HASH = '$2b$10$BUli0c.muyCW1ErNJc3jL.vFRFtFJWrT8/GcR4A.sUdCznaXiqFXa';

const password = process.env.ADMIN_PASSWORD || '';

if (!password) {
  console.log('ADMIN_PASSWORD is not set: the admin account keeps its current password.');
  process.exit(0);
}
if (password.length < 8) {
  console.log('ADMIN_PASSWORD is shorter than 8 characters: not applied.');
  process.exit(0);
}

const url = new URL(process.env.DATABASE_URL);
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: url.toString() }, { schema: url.searchParams.get('schema') }),
});

try {
  const hash = bcrypt.hashSync(password, 10);
  const changed = await prisma.$executeRaw`UPDATE "user" SET password = ${hash}, updated_at = now() WHERE user_id = ${SYSTEM_USER_ID}::uuid AND password = ${DEFAULT_HASH}`;
  console.log(
    changed
      ? 'Admin password set from ADMIN_PASSWORD (user "admin").'
      : 'Admin password was already changed: ADMIN_PASSWORD not applied.',
  );
} finally {
  await prisma.$disconnect();
}
