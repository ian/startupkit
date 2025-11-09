import type { StartupKitConfig } from 'startupkit/config';

const config: StartupKitConfig = {
  type: 'package',
  dependencies: {
    packages: ['db'],
    config: ['biome', 'typescript'],
  },
};

export default config;
