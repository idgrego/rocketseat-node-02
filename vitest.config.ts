import { defineConfig,  } from 'vitest/config';
import { FilenameSequencer } from './tests/_sequencer.js';
export default defineConfig({
  test: {
    // Aponta para o arquivo de setup global
    globalSetup: './tests/_setup.ts',
    sequence: {
      sequencer: FilenameSequencer
    },
  },
});