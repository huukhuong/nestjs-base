import { DataSource } from 'typeorm';
import { dataSourceOption } from '../data-source';
import { userSeeder } from './user.seeder';

async function runSeeds(): Promise<void> {
  const dataSource = new DataSource(dataSourceOption);

  await dataSource.initialize();
  try {
    await userSeeder(dataSource);
  } finally {
    await dataSource.destroy();
  }
}

void runSeeds();
