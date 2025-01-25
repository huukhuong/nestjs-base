import { config } from 'dotenv';
import { ENV } from 'src/config/env';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from './snake-naming-strategy';
config();

export const dataSourceOption: DataSourceOptions = {
  type: 'mysql',
  port: ENV.DB_PORT,
  host: ENV.DB_HOST,
  username: ENV.DB_USERNAME,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_DATABASE,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
  migrationsTableName: 'migrations',
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy()
};

const dataSource = new DataSource(dataSourceOption);
export default dataSource;
