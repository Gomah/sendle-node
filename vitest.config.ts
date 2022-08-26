/// <reference types="vitest" />

import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv('', process.cwd(), '');

  // * Assign process.env
  Object.assign(process.env, env);

  return {
    test: {
      testTimeout: 20000,

      // Isolate environment for each test file. Does not work if you disable --threads.
      isolate: true,

      // Show heap usage after each test
      logHeapUsage: true,
    },
  };
});
