import { NestLensConfig } from 'nestlens';

export const nestlensConfig: NestLensConfig = {
  enabled: true,
  watchers: {
    schedule: {
      enabled: true,
    },
    job: {
      enabled: true,
    },
    mail: {
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
    interval: Number(process.env.NESTLENS_INTERVAL_MINUTES),
    maxAge: Number(process.env.NESTLENS_MAX_AGE_DAYS) * 24,
  },
};
