import type { StartupKitConfig } from 'startupkit/config';

const config: StartupKitConfig = {
  type: 'package',
  dependencies: {
    config: ['typescript'],
  },
};

export default config;
