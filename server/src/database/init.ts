import { storage } from './storage.js';

async function run() {
  console.log('--- Initializing TalentMatch AI Database Schema ---');
  await storage.initDatabaseSchemaAndSeed();
  console.log('--- Database Initialization Completed ---');
  process.exit(0);
}

run().catch((err) => {
  console.error('Database initialization error:', err);
  process.exit(1);
});
