import { NestLensConfig } from 'nestlens';

const nestlensConfig: NestLensConfig = {
  enabled: true,
  watchers: {
    schedule: {
      enabled: true,
    },
    job: {
      enabled: true,
    },
  },
  storage: {
    driver: 'sqlite',
    sqlite: {
      filename: '.cache/nestlens.db',
    },
  },
  pruning: {
    enabled: true,
    interval: 12 * 60, // 12 hours
    maxAge: 7 * 24, // 7 days
  },
};

export default nestlensConfig;
