import { DataSource } from 'typeorm';
import { dataSourceOption } from '../data-source';
import { superAdminSeeder } from './super-admin.seeder';

async function runSeeds(): Promise<void> {
  const dataSource = new DataSource(dataSourceOption);

  await dataSource.initialize();
  try {
    await superAdminSeeder(dataSource);
  } finally {
    await dataSource.destroy();
  }
}

void runSeeds();
