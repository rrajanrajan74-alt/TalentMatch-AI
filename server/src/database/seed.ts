import { storage } from './storage.js';

async function seed() {
  console.log('--- Seeding TalentMatch AI Database ---');
  await storage.initDatabaseSchemaAndSeed();
  console.log('--- Seeding Completed Successfully ---');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
