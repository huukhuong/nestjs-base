import { config } from 'dotenv';
config();

export const ENV = {
  UUID_EXAMPLE: 'd93a4144-19d5-41b3-bb68-8233c86fc6ae',
  DB_HOST: process.env.DB_HOST,
  DB_PORT: Number(process.env.DB_PORT || 3306),
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
  MAIL_FROM: process.env.MAIL_FROM,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME,
  JWT_REFRESH_EXPIRATION_TIME: process.env.JWT_REFRESH_EXPIRATION_TIME,
  HASH_ROUND: Number(process.env.HASH_ROUND || 12),
};
