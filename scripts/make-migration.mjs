/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { format } from 'sql-formatter';

const run = (command, args) => {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

const getLatestMigrationFile = (migrationsDir, migrationName) => {
  const files = readdirSync(migrationsDir)
    .filter(file => file.endsWith('.ts') && file.includes(migrationName))
    .sort();

  if (files.length === 0) {
    return null;
  }

  return join(migrationsDir, files[files.length - 1]);
};

const formatMigrationSql = filePath => {
  const content = readFileSync(filePath, 'utf8');
  const formatted = content.replace(
    /(queryRunner\.query\(\s*`)([\s\S]*?)(`\s*(?:,\s*[\s\S]*?)?\);)/g,
    (fullMatch, prefix, sql, suffix) => {
      const prettySql = format(sql.trim(), { language: 'postgresql' });
      if (!prettySql.includes('\n')) {
        return `${prefix}${prettySql}${suffix}`;
      }
      const indentedSql = prettySql
        .split('\n')
        .map(line => `      ${line}`)
        .join('\n');
      return `${prefix}\n${indentedSql}\n    ${suffix}`;
    },
  );

  if (formatted !== content) {
    writeFileSync(filePath, formatted, 'utf8');
  }
};

const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Error: Migration name is required');
  console.error('Usage: pnpm make:migration <migration-name>');
  process.exit(1);
}

const migrationPath = `database/migrations/${migrationName}`;
const migrationsDir = join(process.cwd(), 'database/migrations');

run('pnpm', ['run', 'build']);

if (existsSync(join(process.cwd(), '.env'))) {
  run('dotenv', [
    '-e',
    '.env',
    '--',
    'npx',
    'typeorm',
    'migration:generate',
    migrationPath,
    '-d',
    'dist/database/data-source.js',
  ]);
} else {
  run('npx', [
    'typeorm',
    'migration:generate',
    migrationPath,
    '-d',
    'dist/database/data-source.js',
  ]);
}

const latestMigration = getLatestMigrationFile(migrationsDir, migrationName);
if (!latestMigration) {
  console.error('Could not find generated migration file to format.');
  process.exit(1);
}

formatMigrationSql(latestMigration);
run('npx', ['prettier', '--write', latestMigration]);
