import { DataSource } from 'typeorm';
import { dataSourceOption } from '../data-source';

async function runSeeds(): Promise<void> {
  const dataSource = new DataSource(dataSourceOption);

  await dataSource.initialize();
  try {
    // TODO: Add seeders here
  } finally {
    await dataSource.destroy();
  }
}

void runSeeds();
