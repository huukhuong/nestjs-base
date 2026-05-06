/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const run = (command, args) => {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

run('pnpm', ['run', 'build']);

if (existsSync(join(process.cwd(), '.env'))) {
  run('dotenv', [
    '-e',
    '.env',
    '--',
    'node',
    'dist/database/seeds/run-seeds.js',
  ]);
} else {
  run('node', ['dist/database/seeds/run-seeds.js']);
}
