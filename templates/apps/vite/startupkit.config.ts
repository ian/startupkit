import type { StartupKitConfig } from 'startupkit/config';

const config: StartupKitConfig = {
  type: 'app',
  dependencies: {
    packages: ['analytics', 'auth', 'db', 'ui', 'utils'],
    config: ['biome', 'typescript'],
  },
};

export default config;
