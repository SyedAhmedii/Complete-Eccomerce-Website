import * as migration_20260925_211501_migration from './20260925_211501_migration';

export const migrations = [
  {
    up: migration_20260925_211501_migration.up,
    down: migration_20260925_211501_migration.down,
    name: '20260925_211501_migration'
  },
];
