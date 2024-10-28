'use strict';

const DatabaseService = require('../../src/features/setup/db-connection-manager');

async function main() {
  const databaseName = 'woper';

  try {
    console.log(`Starting database creation for: ${databaseName}`);
    const databaseService = new DatabaseService();
    await databaseService.createDatabase(databaseName);
    console.log(`Database ${databaseName} created successfully`);
  } catch (error) {
    console.error(`Error creating database: ${error.message}`);
    throw error;
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error.message);
  throw error;
});
