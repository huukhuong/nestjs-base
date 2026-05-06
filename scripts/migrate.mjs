/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const DATA_SOURCE_PATH = 'dist/database/data-source.js';

const run = (command, args) => {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

const runTypeorm = command => {
  const args = ['npx', 'typeorm', command, '-d', DATA_SOURCE_PATH];
  if (existsSync(join(process.cwd(), '.env'))) {
    run('dotenv', ['-e', '.env', '--', ...args]);
    return;
  }
  run('npx', ['typeorm', command, '-d', DATA_SOURCE_PATH]);
};

const action = process.argv[2];

if (!action) {
  console.error('Error: Action is required');
  console.error('Usage: node scripts/migrate.mjs <run|fresh|revert>');
  process.exit(1);
}

run('pnpm', ['run', 'build']);

if (action === 'run') {
  runTypeorm('migration:run');
} else if (action === 'fresh') {
  runTypeorm('schema:drop');
  runTypeorm('migration:run');
} else if (action === 'revert') {
  runTypeorm('migration:revert');
} else {
  console.error(`Unknown action: ${action}`);
  console.error('Usage: node scripts/migrate.mjs <run|fresh|revert>');
  process.exit(1);
}
