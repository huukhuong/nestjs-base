import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from './snake-naming-strategy';
import { configDotenv } from 'dotenv';

configDotenv();

export const dataSourceOption: DataSourceOptions = {
  type: 'postgres',
  port: Number(process.env.DATABASE_PORT),
  host: String(process.env.DATABASE_HOST),
  username: String(process.env.DATABASE_USERNAME),
  password: String(process.env.DATABASE_PASSWORD),
  database: String(process.env.DATABASE_NAME),
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
};

const dataSource = new DataSource(dataSourceOption);
export default dataSource;
