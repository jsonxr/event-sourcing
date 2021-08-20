import path from 'path'
import fs from 'fs/promises'
import pg, { Client } from 'pg'
import { DateTime } from 'luxon';
import env from '../env';
import { loadMigrationFiles, migrate } from "postgres-migrations"

// Recommended patch of pg from https://www.npmjs.com/package/postgres-migrations
// BEGIN
const parseDate = (val) => DateTime.fromISO(val).format('YYYY-MM-DD')
const DATATYPE_DATE = 1082
pg.types.setTypeParser(DATATYPE_DATE, val => {
  return val === null ? null : parseDate(val)
})
// END

const MIGRATION_DIR = path.resolve(__dirname, "sql/migrations")
const ERRORS = {
  ECONNREFUSED: 'ECONNREFUSED',
  INVALID_CATALOG: '3D000',
  ACTIVE_SESSIONS: '55006',
};
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const processError = (err) => {
  console.error('\n\nError!!!!!!!!')
  switch (err.code) {
    case ERRORS.INVALID_CATALOG:
      console.error(`Unknown database name "${env.POSTGRES_DATABASE}"`)
      break;
    case ERRORS.ECONNREFUSED:
      console.error(`Connection to ${err.address}:${err.port} refused`)
      break;
    case ERRORS.ACTIVE_SESSIONS:
      console.error(err.detail);
      break;
    default:
      console.error(err);
  }
  process.exit(1);
}

const adminCommand = async (connectionString: string, sql: string) => {
  const client = new Client({ // No pool needed for this command
    connectionString,
  });

  try {
    await client.connect();
    const results = await client.query(sql);
    return results
  } finally {
    await client.end();
  }
}

const createDatabase = async (connectionString: string, databaseName: string) => {
  console.log(`Creating database ${databaseName}`)
  const result = await adminCommand(connectionString, `CREATE DATABASE ${databaseName};`);
  console.log(`Done.`);
}

const dropDatabase = async (connectionString: string, databaseName: string) => {
  const sql = `DROP DATABASE ${databaseName};`;
  try {
    console.log(`Dropping database "${databaseName}"...`)
    await adminCommand(connectionString, sql);
    console.log('Done.')
  } catch (err) {
    // We don't care if this database doesn't exist
    if (err.code !== ERRORS.INVALID_CATALOG) {
      processError(err);
    }
  }
}

const runBootstrap = async (connectionString: string, databaseName: string) => {
  await createDatabase(connectionString, databaseName);

  const client = new Client({ // No pool needed for this command
    connectionString: `${connectionString}/${databaseName}`,
  });
  try {
    await client.connect();
    try {
      // Execute bootstrap.sql, this is when you have an
      // existing structure and want to start using migrations
      const bootstrapFilename = path.resolve(__dirname, 'sql/bootstrap.sql');
      const sql = await fs.readFile(bootstrapFilename, { encoding: 'utf8'});
      await client.query(sql);
    } catch (err) {
      processError(err);
    }
  } catch(err){
    processError(err);
  }
  await client.end();
}

const runMigrations = async (connectionString: string) => {
  try {
    loadMigrationFiles(MIGRATION_DIR);
  } catch(err) {
    console.error('Migration error: ', err);
    process.exit(-1);
  }

  console.log('running migrations...')
  const client = new Client({ // No pool needed for this command
    connectionString,
  });
  await client.connect()
  try {
    await migrate({client}, MIGRATION_DIR, { logger: console.log })
  } finally {
    await client.end()
  }
}

interface ExecuteOptions {
  bootstrap: boolean,
  drop: boolean
}
export const execute = async (options: ExecuteOptions) => {
  if (options.bootstrap) {
    if (options.drop) {
      if (env.NODE_ENV !== 'development') {
        console.error('Cowardly refusing to run drop database unless NODE_ENV is set to development.')
        process.exit(1)
      } else {
        await dropDatabase(`${env.POSTGRES_CONNECTION}`, env.POSTGRES_DATABASE);
      }
    }

    console.log('creating database...')
    await runBootstrap(`${env.POSTGRES_CONNECTION}`, env.POSTGRES_DATABASE);
  }

  runMigrations(`${env.POSTGRES_CONNECTION}/${env.POSTGRES_DATABASE}`);
}
