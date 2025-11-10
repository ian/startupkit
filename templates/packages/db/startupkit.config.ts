import type { StartupKitConfig } from 'startupkit/config';

const config: StartupKitConfig = {
  type: 'package',
  dependencies: {
    config: ['biome', 'typescript'],
  },
};

export default config;
