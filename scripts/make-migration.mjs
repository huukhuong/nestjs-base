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

const reorderCreateTableColumns = filePath => {
  const content = readFileSync(filePath, 'utf8');
  const createTableRegex = /CREATE TABLE\s+"[^"]+"\s*\(\n([\s\S]*?)\n(\s*)\)/g;

  const reordered = content.replace(
    createTableRegex,
    (fullMatch, body, closingIndent) => {
      const lines = body.split('\n');
      if (lines.length === 0) {
        return fullMatch;
      }

      const lineIndent = lines[0].match(/^\s*/)?.[0] ?? '        ';
      const entries = lines
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => line.replace(/,$/, ''));

      const idColumns = [];
      const timestampColumns = [];
      const regularColumns = [];
      const constraints = [];

      for (const entry of entries) {
        if (/^"id"\s/i.test(entry)) {
          idColumns.push(entry);
          continue;
        }

        if (/^"(created_at|updated_at|deleted_at)"\s/i.test(entry)) {
          timestampColumns.push(entry);
          continue;
        }

        if (/^"/.test(entry)) {
          regularColumns.push(entry);
          continue;
        }

        constraints.push(entry);
      }

      const orderedEntries = [
        ...idColumns,
        ...regularColumns,
        ...timestampColumns,
        ...constraints,
      ];

      if (orderedEntries.length === 0) {
        return fullMatch;
      }

      const rebuiltBody = orderedEntries
        .map((entry, index) => {
          const suffix = index === orderedEntries.length - 1 ? '' : ',';
          return `${lineIndent}${entry}${suffix}`;
        })
        .join('\n');

      return fullMatch.replace(
        body,
        rebuiltBody.replace(new RegExp(`\n${closingIndent}$`), ''),
      );
    },
  );

  if (reordered !== content) {
    writeFileSync(filePath, reordered, 'utf8');
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
reorderCreateTableColumns(latestMigration);
run('npx', ['prettier', '--write', latestMigration]);
